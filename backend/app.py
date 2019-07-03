from flask import Flask, request, jsonify

app = Flask(__name__, static_folder='checkin/build')
api = Api(app)

app.config["DEBUG"] = True

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve():
    return "<p>Serve the react app through here.</p>"

if __name__ == '__main__':
    app.run(threaded=True)