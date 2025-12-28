# Frontend and backend communicate through HTTP requests
from flask import Flask, jsonify
from flask_cors import CORS


# Creates an app instance
app = Flask(__name__)
cors = CORS(app, origins='*')

# Creates a route for the API
@app.route('/api/users', methods=['GET'])
def users():
    return jsonify(
        {
            "users": [
                "bob",
                "zack",
                "alice"
            ]
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=8080)