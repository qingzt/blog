from flask import Flask, jsonify
from models.discussion import DiscussionModel

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello, World!'})

@app.route('/discussions', methods=['GET'])
def get_discussions():
    discussions = DiscussionModel.select()
    dis = [discussion.toDiscussion() for discussion in discussions]
    return dis[0].body

if __name__ == '__main__':
    app.run(debug=True, port=5000)