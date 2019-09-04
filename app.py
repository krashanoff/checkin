import os
import json
import urllib.parse
from datetime import datetime

from flask import Flask, render_template, jsonify, request, abort, redirect, url_for, flash
from flask_cors import CORS
from flask_login import LoginManager, UserMixin, login_required, logout_user, login_user, current_user

import WaApi

# Import gapi and create the credentials.json file.
import gapi
gapi.createCredsFromEnv()

""" TODO:
* Use environ.get() instead of referencing directly via key.
  Also throw errors if they are not present.
* Catch improper data types provided in each request.
"""

"""
FLASK CONFIG
"""
# Set up our app.
app = Flask(__name__,
            static_folder = './checkin/build/static',
            template_folder = './checkin/build')
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'dev'
)

"""
CORS
"""
# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {
    "origins": "*",
    "methods": ['GET', 'POST']
    }})
app.config['CORS_HEADERS'] = ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']

"""
API FUNCTIONALITY
"""
# Set up our Wild Apricot API client, then validate with contact credentials.
api = WaApi.WaApiClient(os.environ['WA_CLIENT_ID'], os.environ['WA_CLIENT_SECRET'])
api.authenticate_with_contact_credentials(os.environ['WA_USERNAME'], os.environ['WA_PASSWORD'])

accountsBase = "/v2.1/accounts/" + os.environ['WA_ID']
emailBase = "/v2.1/rpc/" + os.environ['WA_ID'] + "/email"

# Get our `service` variable for the Google Sheets API.
SPREADSHEET_ID = os.environ['SPREADSHEET_ID']
service = gapi.getApi()

"""
LOGIN MANAGEMENT
"""

# Set up the login service and "database".
login_manager = LoginManager()
login_manager.init_app(app)

db = { os.environ['USERNAME']: { 'password': os.environ['PASSWORD'] }}

class User(UserMixin):
    pass

@login_manager.user_loader
def user_loader(username):
    if username not in db:
        return
    
    user = User()
    user.id = username
    return user

@login_manager.request_loader
def request_loader(request):
    username = request.form.get('username')

    if username not in db:
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
@app.route("/api/search/<lastName>", methods=["GET"])
@login_required
def search(lastName):
    # Catch a lack of search query.
    if lastName is None:
        return 'Invalid query.'

    searchQuery = str(lastName)

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

# Retrieves all pertinent data about a *specific* contact.
@app.route("/api/userInfo/<uid>", methods=["GET"])
@login_required
def userInfo(uid):
    if uid is None:
        return 'Invalid query.'

    # Collect our basic information.
    response = api.execute_request(accountsBase + "/contacts/" + str(uid))
    data = parseContact(response)

    # Collect additional critical information:
    #   - Phone number
    #   - Spouse phone number
    #   - Address components
    data.update({ 'email': response.Email })

    for field in response.FieldValues:
        if field.FieldName == r"Primary Member's Phone":
            data.update({ 'primaryPhone': field.Value })

        if field.FieldName == r"Spouse / Partner Phone":
            data.update({ 'spousePhone': field.Value })
        
        if field.FieldName == r"House # Only":
            data.update({ 'houseNumber': str(field.Value) })

        if field.FieldName == r"Street":
            data.update({ 'street': str(field.Value) })
        
        if field.FieldName == r"City":
            data.update({ 'city': str(field.Value) })

        if field.FieldName == r"State":
            data.update({ 'state': str(field.Value.Label) })
        
        if field.FieldName == r"Zip":
            data.update({ 'zip': str(field.Value) })

    # Respond.
    return data

# TODO: Send an emergency email to all SHHA pool members.
@app.route("/api/sendMail", methods=["POST"])
@login_required
def sendMail():
    return 'MAIL SENT'
    
    params = '?' + urllib.parse.urlencode({
        'sendEmailParams': {
            'Subject': 'Important Notice for SHHA Pool Members',
            'Body': request.form['body'],
            'Recipients': [
                {
                    'RECIPIENTS'
                }
            ]
        }
    })

    # response = api.execute_request(emailbase + '/SendEmail' + params)
    return 'SEND AN EMAIL TO MEMBERS, THEN DISPLAY CONFIRMATION.'

# Takes a JSON object and logs it to our Google Sheets spreadsheet.
@app.route("/api/log", methods=["POST"])
@login_required
def log():
    # Convert our data from byte-like -> JSON.
    jsonData = json.loads(urllib.parse.unquote(request.data.decode('utf8')))

    # Sanitize to ensure the request is as expected.
    if 'data' not in jsonData:
        return 'ERROR: MISSING REQUIRED DATA'
    
    # Get our data.
    data = jsonData['data']
    
    # Set up the body that will be sent in our request to Google Sheets' API.
    body = {
        'values': [
            [
                datetime.utcnow().strftime("%Y-%b-%d %H:%M"),
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

    # Insert the values.
    service.spreadsheets().values().append(
        spreadsheetId=SPREADSHEET_ID, range='Sheet1!A2:N',
        valueInputOption='RAW', insertDataOption='INSERT_ROWS', body=body).execute()

    return 'Check-in logged successfully.'

"""
ADMIN
"""
# Provides a login page for the admin table.
@app.route("/admin/login", methods=["GET", "POST"])
def login():
    # If provided a GET request, then return our login page.
    if request.method == 'GET':
        return render_template('protected/login.html')

    # Since our database is currently lackluster, check to make sure we don't cause
    # any errors with the request passed.
    if ('username' not in request.form) or (request.form['username'] not in db):
        return 'ERROR: BAD REQUEST'

    # Get the username from the request.
    username = request.form['username']

    # Validate the information and then pass to the admin page.
    if request.form['password'] == db[username]['password']:
        
        user = User()
        user.id = username
        login_user(user)

        return redirect(url_for('react'))

    # Under all other conditions, return an error.
    return 'ERROR: BAD REQUEST'

# Logout the current user.
@app.route("/admin/logout")
def logout():
    logout_user()
    
    return 'Logged out successfully.'

"""
WEBPAGES
"""

# Render our SPA
@app.route("/")
@login_required
def react():
    return render_template("index.html")

# 404
@app.route("/<path:path>")
def missing(path):
    return redirect(url_for('react'))

if __name__ == "__main__":
    app.run(use_reloader=True)