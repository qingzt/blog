from flask import Flask, jsonify
from models.discussion import Discussion, DiscussionModel, db

app = Flask(__name__)

@app.route('/hello', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello, World!'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)