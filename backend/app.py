import os
import urllib.parse
import json
from flask import Flask, render_template, jsonify, request, abort
from flask_cors import CORS
from . import db
from . import WaApi

# Set up our app.
app = Flask(__name__,
            static_folder = '../checkin/build/static',
            template_folder = '../checkin/build')
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'dev',
    DATABASE = './.sqlite'
)

# Add the database.
db.init_app(app)

# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']

# Set up our API client, then validate with contact credentials.
api = WaApi.WaApiClient(os.environ['WA_CLIENT_ID'], os.environ['WA_CLIENT_SECRET'])
api.authenticate_with_contact_credentials(os.environ['WA_USERNAME'], os.environ['WA_PASSWORD'])

"""
API
Below is the code supplying all relevant information, etc. for the webapp.
"""

# Searches the database for members whose last names start with the query.
@app.route("/api/search", methods=["GET"])
def search():
    # Catch a lack of search query.
    if 'lastName' not in request.args:
        return "ERROR: No lastName provided for query."

    """
    NOTE: This only checks whether the request has a SUBSTRING of the last name.
    This is because the API provided by Wild Apricot lacks the ability to search through a specific field.
    As a result, this function of the API simply filters the results after the fact.
    """

    searchQuery = str(request.args['lastName'])

    # Compose the filter string that we need to get our desired search. Then, run the search.
    filterString = r"Status eq 'Active' AND 'Group participation' eq 'Pool Members' AND substringof(LastName, '" + searchQuery + r"')"

    params = '?' + urllib.parse.urlencode({
        '$filter': filterString,
        '$top': '50',
        '$sort': 'Name asc',
        '$async': 'false'
    })

    results = api.execute_request("/v2.1/accounts/" + os.environ['WA_ID'] + "/contacts" + params)

    # Pick out only the names that *start* with the search query.
    funneled = []

    for contact in results.Contacts:
        if str(contact.LastName).upper().startswith(searchQuery.upper()):
            funneled.append(contact)

    # Parse each name for relevant information.
    filteredResults = []

    for i, contact in enumerate(funneled):

        # Append relevant contact information.
        filteredResults.append( {} )        
        filteredResults[i].update({ 'id': contact.Id })
        filteredResults[i].update({ 'accountFirst': contact.FirstName, 'accountLast': contact.LastName })
        filteredResults[i].update({ 'caregivers': [] })
        filteredResults[i].update({ 'children': [] })
        
        # Big switch/case statement to catch relevant information.
        for field in contact.FieldValues:

            caregiverCount = 0
            childCount = 0

            if "House # Only" == field.FieldName and field.Value != "":
                filteredResults[i].update({ 'houseNumber': int(field.Value) })

            if "Spouse / Partners First Name" == field.FieldName and field.Value != "":
                filteredResults[i].update({ 'altFirst': field.Value })
            
            if "Spouse / Partners Last Name" == field.FieldName and field.Value != "":
                filteredResults[i].update({ 'altLast': field.Value })
            
            if "Designated Caregiver First Last Name" in field.FieldName and field.Value != "":
                key = str('caregiver' + str(caregiverCount) + 'Name')
                filteredResults[i]['caregivers'].append(field.Value)

            if "Child's First Name & (Year of Birth)" in field.FieldName and field.Value != "":
                key = str('child' + str(childCount) + 'Name')
                filteredResults[i]['children'].append(field.Value)
        
    # Finally, return all of our data as a JSON object to the client.                    
    return jsonify(filteredResults)

@app.route("/api/log", methods=["POST"])
def log():
    return 'logging page here.'

# Provides a login page for the admin table.
@app.route("/api/login", methods=["GET", "POST"])
def login():
    # Serve the login page.
    if request.method == "GET":
        print("GET")
    # Verify the login.
    else:
        print("POST")

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