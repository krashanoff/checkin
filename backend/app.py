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

# Retrieve the relevant info about a contact and their family from the API directly.
@app.route("/api/contactinfo", methods=["GET"])
def contactInfo():
    id = request.form['id']
    
    if not id:
        print('ERROR: No user ID was provided.')

    return id

# Provides a login page for the admin table.
@app.route("/api/login", methods=["GET", "POST"])
def login():
    # Serve the login page.
    if request.method == "GET":
        print("GET")
    # Verify the login.
    else:
        print("POST")

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