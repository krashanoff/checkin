import os
import urllib.parse
import json
from flask import Flask, render_template, jsonify, request, abort
from flask_cors import CORS
from . import WaApi

""" TODO:
* Known issue: There are some contacts whose entries are completely
empty in the database. This creates the issue that we have blank or
undefined pieces of information in our search results or check-in
page.
* Catch improper data types provided in each request.
"""

# Set up our app.
app = Flask(__name__,
            static_folder = '../checkin/build/static',
            template_folder = '../checkin/build')
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'dev'
)

# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {"origins": "*"}})
app.config['CORS_HEADERS'] = ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin']

# Set up our API client, then validate with contact credentials.
api = WaApi.WaApiClient(os.environ['WA_CLIENT_ID'], os.environ['WA_CLIENT_SECRET'])
api.authenticate_with_contact_credentials(os.environ['WA_USERNAME'], os.environ['WA_PASSWORD'])

"""
API
"""

# Searches the database for members whose last names start with the query.
@app.route("/api/search", methods=["GET"])
def search():
    # Catch a lack of search query.
    if 'lastName' not in request.args:
        return "ERROR: No lastName provided for query."

    """
    NOTE: This query only checks whether the request has a SUBSTRING of the last name.
    This is because the API provided by Wild Apricot lacks the ability to search through a specific field.
    As a result, this function of the API simply filters the results after the fact.
    """

    searchQuery = str(request.args['lastName'])

    # Compose the filter string that we need to get our desired search. Then, run the search.
    filterString = r"Status eq 'Active' AND 'Group participation' eq 'Pool Members' AND substringof(LastName, '" + searchQuery + r"')"

    params = '?' + urllib.parse.urlencode({
        '$filter': filterString,
        '$top': '20',
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

            if "Spouse / Partners First Name" == field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
                filteredResults[i].update({ 'altFirst': field.Value })
            
            if "Spouse / Partners Last Name" == field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
                filteredResults[i].update({ 'altLast': field.Value })
            
            if "Designated Caregiver First Last Name" in field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
                filteredResults[i]['caregivers'].append(field.Value)

            if "Child's First Name & (Year of Birth)" in field.FieldName and field.Value != "" and field.Value != "None" and field.Value != None:
                filteredResults[i]['children'].append(field.Value)
        
    # Finally, return all of our data as a JSON object to the client.                    
    return jsonify(filteredResults)

"""
Expects two pieces of JSON: the original contact returned
by /api/search, and the contact containing only the fields
for the members checking in. It uses these in tandem to log
the check-in as though it were a difference between the two
(think `git diff HEAD~ > change.patch`).
"""
@app.route("/api/log", methods=["POST"])
def log():
    # Convert our data from byte-like -> JSON.
    print(request.data)
    newjson = json.loads(request.data.decode('utf8').replace('\'', '\"'))

    return 'Check-in logged. Our data logged is: ' + str(newjson['info'])

# Provides a login page for the admin table.
@app.route("/api/login", methods=["GET", "POST"])
def login():
    # Serve the login page.
    if request.method == "GET":
        print("GET")

    # Verify the login then redirect with token.
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