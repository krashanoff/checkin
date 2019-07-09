"""
NOTES:
* Right now there is some weird behavior going on with the flask app
  when rendering the start page. All suggestions appear immediately
  with no regard to the current input. Will require further research.
"""

import os
from flask import Flask, render_template
from flask_cors import CORS

app = Flask(__name__,
            static_folder = "../checkin/build/static",
            template_folder = "../checkin/build")
app.config["CORS_HEADERS"] = "Content-Type"

# Protect our API so that only the server can access it.
cors = CORS(app, resources={r"/api/*": {"origins": "localhost"}})

# All the API routes
@app.route("/api/cat", methods=["GET"])
def cat():
    return "CAT!"

@app.route("/api/")

# Render our SPA
@app.route("/")
def react():
    return render_template("index.html")

app.debug=True
app.use_reloader=True

if __name__ == "__main__":
    app.run()