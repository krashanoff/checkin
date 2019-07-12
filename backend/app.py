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
    DATABASE = './users.sqlite'
)

# Add the database.
db.init_app(app)

# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost"}})
app.config['CORS_HEADERS'] = ['Content-Type', 'Authorization']

# Set up our API client, then validate with contact credentials.
api = WaApi.WaApiClient(os.environ['WA_CLIENT_ID'], os.environ['WA_CLIENT_SECRET'])
api.authenticate_with_contact_credentials(os.environ['WA_USERNAME'], os.environ['WA_PASSWORD'])

"""
API
Below is the code supplying all relevant information, etc. for the webapp.
"""

# Searches the database for members whose last name contains the query.
@app.route("/api/searchMembers", methods=["GET"])
def searchMembers():

    if 'lastName' not in request.args:
        return "ERROR: No lastName provided for query."

    # NOTE: This only checks whether the request has a SUBSTRING of the last name.
    filterString = r"Status eq 'Active' AND 'Group participation' eq 'Pool Members' AND substringof(LastName, '" + str(request.args['lastName']) + r"')"

    params = '?' + urllib.parse.urlencode({
        '$filter': filterString,
        '$top': '10',
        '$sort': 'Name asc',
        '$async': 'false'
    })
    
    results = api.execute_request("/v2.1/accounts/" + os.environ['WA_ID'] + "/contacts" + params)

    # Mess of a script to print out the names of pool members.
    # I'm 90% sure the above filter works, but I'm leaving this here just in case.
    test = ''
    for idx, item in enumerate(results.Contacts):
        test += str(item.FirstName + ' ' + item.LastName + ': ')
        for a in item.FieldValues:
            if a.FieldName == "Group participation":
                for b in a.Value:
                    if b == "Pool Members":
                        test += 'Pool member'
                    else:
                        test += 'Not member'
        test += '<br />'
        if idx == 0:
            for a in item.FieldValues:
                print(a.FieldName + ' ' + str(a.Value))

    return test

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