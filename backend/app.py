import os
from flask import Flask, render_template, jsonify, request
from flask_cors import CORS

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
from . import db
db.init_app(app)

# Protect our API so that only the server can access it.
cors = CORS(app, resources=r"/api/*", origins=["127.0.0.1"])

"""
API
Below is the code supplying all relevant information, etc. for the webapp.
"""

@app.route("/api/cat", methods=["GET"])
def cat():
    return 'Cat!'

# Set the PIN of the user specified, if no PIN already exists.
@app.route("/api/setpin", methods=["POST"])
def setPin():
    print(request.form)
    info = [request.form['id'], request.form['pin']]
    
    for entry in info:
        if not entry:
            return 'ERROR: Missing field %s' % entry
    
    db = get_db()

    c = db.cursor()
    c.execute('SELECT id, pin FROM users')
    query = c.fetchall()
    for x in query:
        print(x)
    
    db.execute(
        'INSERT INTO users (id, pin) VALUES (?, ?)',
        (info[0], generate_password_hash(info[1]))
    )
    db.commit()

    return 'SUCCESS'

# Retrieve the relevant info about a contact from the API directly.
@app.route("/api/contactinfo", methods=["GET"])
def contactInfo():
    id = request.form['id']
    
    if not id:
        print('ERROR: No user ID was provided.')

    return id

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