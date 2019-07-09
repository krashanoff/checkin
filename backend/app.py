"""
NOTES:
* Right now there is some weird behavior going on with the flask app
  when rendering the start page. All suggestions appear immediately
  with no regard to the current input. Will require further research.
"""

import os
from flask import Flask, render_template, jsonify
from flask_cors import CORS

app = Flask(__name__,
            static_folder = '../checkin/build/static',
            template_folder = '../checkin/build')
app.config.update(
    DEBUG = True,
    SECRET_KEY = 'dev',
    DATABASE = './users.sqlite'
)

# Add the database.
from . import db
db.init_app(app)

# Protect our API so that only the server can access it.
cors = CORS(app, resources=r"/api/*", origins=["127.0.0.1"])

"""
All the API routes
"""

# Set the PIN of the user specified, if no PIN already exists.
@app.route("/api/setpin", methods=["POST"])
def setPin():
    info = [request.form['id'], request.form['pin']]
    
    for entry in info:
        if not entry:
            return 'ERROR: Missing field %s' % entry
    
    db = get_db()
    
    db.execute(
        'INSERT INTO users (id, pin) VALUES (?, ?)',
        (username, generate_password_hash(pin))
    )
    db.commit()

    return 'SUCCESS'

# Retrieve the relevant info about a contact from the API directly.
@app.route("/api/contactinfo", methods=["GET"])
def contactInfo():
    id = request.form['id']
    
    if not id:
        flash('ERROR: No user ID was provided.')

    return id

# Render our SPA
@app.route("/")
def react():
    return render_template("index.html")

# 404
@app.route('/<path:path>')
def missing(path):
    return '404: %s does not exist.' % path

if __name__ == "__main__":
    app.run(use_reloader=True)