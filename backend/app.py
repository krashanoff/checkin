import os
import json
import urllib.parse
from datetime import datetime

from flask import Flask, render_template, jsonify, request, abort, redirect, url_for, flash
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_required, logout_user, login_user, current_user

from . import WaApi

import pickle
from googleapiclient.discovery import build
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

""" TODO:
* Known issue: There are some contacts whose entries are completely
empty in the database. This creates the issue that we have blank or
undefined pieces of information in our search results or check-in
page.
* Catch improper data types provided in each request.
"""

"""
FLASK CONFIG
"""
# Set up our app.
app = Flask(__name__,
            static_folder = '../checkin/build/static',
            template_folder = '../checkin/build')
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'dev'
)

"""
CORS
"""
# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']

"""
Wild Apricot
"""
# Set up our Wild Apricot API client, then validate with contact credentials.
api = WaApi.WaApiClient(os.environ['WA_CLIENT_ID'], os.environ['WA_CLIENT_SECRET'])
api.authenticate_with_contact_credentials(os.environ['WA_USERNAME'], os.environ['WA_PASSWORD'])

accountsBase = "/v2.1/accounts/" + os.environ['WA_ID']
emailBase = "/v2.1/rpc/" + os.environ['WA_ID'] + "/email"

"""
GOOGLE SHEETS
"""
# Set up the Google Sheets API client. Validate with oAuth key.
SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
SPREADSHEET_ID = os.environ['SPREADSHEET_ID']
creds = None

# The file token.pickle stores the user's access and refresh tokens, and is
# created automatically when the authorization flow completes for the first
# time.
if os.path.exists('token.pickle'):
    with open('token.pickle', 'rb') as token:
        creds = pickle.load(token)

# If there are no (valid) credentials available, let the user log in.
if not creds or not creds.valid:
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
    else:
        flow = InstalledAppFlow.from_client_secrets_file(
            'credentials.json', SCOPES)
        creds = flow.run_local_server()
    # Save the credentials for the next run
    with open('token.pickle', 'wb') as token:
        pickle.dump(creds, token)

service = build('sheets', 'v4', credentials=creds)

"""
USER MANAGEMENT
"""
# Set up the login service and "database"
login_manager = LoginManager()
login_manager.init_app(app)

# TODO: Make a proper database.
tempDb = { 'admin': { 'password': 'P A S S W O R D' }}

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(username):
    if username not in tempDb:
        return
    
    user = User()
    user.id = username
    return user

@login_manager.request_loader
def request_loader(request):
    username = request.form.get('username')

    if username not in tempDb:
        return
        
    user = User()
    user.id = username

    user.is_authenticated = request.form['password'] == users[username]['password']

    return user

"""
UTILITY FUNCTIONS
"""

# Parses a contact and returns the same information that
# our endpoint /api/search would return in a typical query.
# RETURNS A DICTIONARY, NOT JSON.
def parseContact(contact):
    # Parse each name for relevant information.
    contactInfo = {}

    # Append relevant contact information.
    contactInfo.update({ 'id': contact.Id })
    contactInfo.update({ 'accountFirst': contact.FirstName, 'accountLast': contact.LastName })
    contactInfo.update({ 'caregivers': [] })
    contactInfo.update({ 'children': [] })
        
    # Big switch/case statement to catch relevant information.
    for field in contact.FieldValues:

        caregiverCount = 0
        childCount = 0

        if "House # Only" == field.FieldName and field.Value != "":
            contactInfo.update({ 'houseNumber': int(field.Value) })

        if "Spouse / Partners First Name" == field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
            contactInfo.update({ 'altFirst': field.Value })
            
        if "Spouse / Partners Last Name" == field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
            contactInfo.update({ 'altLast': field.Value })

        if "3rd Adult First Last Name" == field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
            contactInfo.update({ 'thirdAdult': field.Value })
            
        if "Designated Caregiver First Last Name" in field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
            contactInfo['caregivers'].append(field.Value)

        if "Child's First Name & (Year of Birth)" in field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
            contactInfo['children'].append(field.Value)

    return contactInfo

"""
API
"""

# Searches the database for members whose last names start with the query.
@app.route("/api/search", methods=["GET"])
def search():
    # Catch a lack of search query.
    if 'lastName' not in request.args:
        return "ERROR: No lastName provided for query."

    searchQuery = str(request.args['lastName'])

    # Compose the filter string that we need to get our desired search. Then, run the search.
    # LevelId
    filterString = r"Status eq 'Active' AND 'Group participation' eq 'Pool Members' AND substringof(LastName, '" + searchQuery + r"')"
    
    # Below is an attempt at a slightly more targeted query.
    # r"Status eq 'Active' AND (MembershipLevel.Id eq 940400 OR MembershipLevel.Id eq 1027996 OR MembershipLevel.Id eq 942729 OR MembershipLevel.Id eq 940712) AND substringof(LastName, '" + searchQuery + r"')"

    params = '?' + urllib.parse.urlencode({
        '$filter': filterString,
        '$top': '20',
        '$sort': 'Name asc',
        '$async': 'false'
    })

    results = api.execute_request(accountsBase + "/contacts" + params)

    # Pick out only the names that *start* with the search query.
    funneled = []

    for contact in results.Contacts:
        if str(contact.LastName).upper().startswith(searchQuery.upper()):
            funneled.append(contact)

    filteredResults = []
    
    for contact in funneled:
        filteredResults.append(parseContact(contact))
        
    # Finally, return all of our data as a JSON object to the client.                    
    return jsonify(filteredResults)

# Takes a JSON object and logs it to our Google Sheets spreadsheet.
@app.route("/api/log", methods=["POST"])
def log():
    # Convert our data from byte-like -> JSON.
    jsonData = json.loads(request.data.decode('utf8').replace('\'', '\"'))

    # Sanitize to ensure the request is as expected.
    if 'data' not in jsonData:
        return 'ERROR: MISSING REQUIRED DATA'
    
    # Get our data.
    data = jsonData['data']
    
    # Set up the body that will be sent in our request to Google Sheets' API.
    body = {
        'values': [
            [
                datetime.now().strftime("%Y-%b-%d %H:%M"),
                data['id'],
                data['lastName']
            ]
        ]
    }

    # Define for later usage.
    vals = body['values'][0]

    # Append our data to the values we will insert.
    parents = data['parents']
    caregivers = data['caregivers']
    children = data['children']

    # We have two possible parent fields.
    for num in range(2):
        if num < len(parents):
            vals.append(str(parents[num]))
        else:
            vals.append('')

    # We have one possible thirdAdult field.
    if 'thirdAdult' in data:
        vals.append(str(data['thirdAdult']))
    else:
        vals.append('')

    # We have three possible caregivers.
    for num in range(3):
        if num < len(caregivers):
            vals.append(str(caregivers[num]))
        else:
            vals.append('')

    # We have six possible children.
    for num in range(6):
        if num < len(children):
            vals.append(str(children[num]))
        else:
            vals.append('')

    # Finally, append the number of guests present.
    body['values'][0].append(data['adultGuests'])
    body['values'][0].append(data['childGuests'])

    print(body['values'])

    print("Appending now.")

    # Insert the values.
    service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID, range='Sheet1!A2:N',
        valueInputOption='RAW', insertDataOption='INSERT_ROWS', body=body).execute()

    return 'Check-in logged successfully.'

# Provides a login page for the admin table.
@app.route("/admin/login", methods=["GET", "POST"])
def login():
    # If provided a GET request, then return our login page.
    if request.method == 'GET':
        return render_template('protected/login.html')

    # Since our database is currently lackluster, check to make sure we don't cause
    # any errors with the request passed.
    if ('username' not in request.form) or (request.form['username'] not in tempDb):
        return 'ERROR: BAD REQUEST'

    # Get the username from the request.
    username = request.form['username']

    # Validate the information and then pass to the admin page.
    if request.form['password'] == tempDb[username]['password']:
        
        user = User()
        user.id = username
        login_user(user)

        return redirect(url_for('admin'))

    # Under all other conditions, return an error.
    return 'ERROR: BAD REQUEST'

# Logout the current user.
@app.route("/admin/logout")
def logout():
    logout_user()
    
    return 'Logged out successfully.'

# Returns the admin page under the conditions that the current user is logged in.
@app.route("/admin")
@login_required
def admin():
    return render_template('protected/admin.html', username = current_user.id)

# Route for getting more information about a specific member.
@app.route("/admin/user/<id>")
@login_required
def userInfo(id):
    # TODO: Sanitize
    response = api.execute_request(accountsBase + '/contacts/' + str(id))

    # Get all the important details, with some small caveats.
    data = parseContact(response)

    return render_template('protected/userInfo.html', data = data)

# TODO: Send an email to all SHHA Pool members.
@app.route("/admin/sendMail", methods=['GET', 'POST'])
@login_required
def sendMail():
    if request.method == 'GET':
        return 'RENDER FORM FOR SENDING THE EMAIL'

    else:
        params = '?' + urllib.parse.urlencode({
            'sendEmailParams': {
                # TODO:
            }
        })

        # response = api.execute_request(emailbase + '/SendEmail' + params)

        return 'SEND AN EMAIL TO MEMBERS, THEN DISPLAY CONFIRMATION.'

"""
WEBPAGES
"""

# Render our SPA
@app.route("/")
def react():
    return render_template("index.html")

# 404
@app.route("/<path:path>")
def missing(path):
    return '404: %s does not exist.' % path

if __name__ == "__main__":
    app.run(use_reloader=True)