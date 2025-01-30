from flask import Flask, jsonify, request
from models.discussion import DiscussionModel
from models.discussion_label import Discussion_LableModel
from models.lable import LabelModel
from peewee import fn
from math import ceil
app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello, World!'})

@app.route('/labels', methods=['GET'])
def get_labels():
    query = (Discussion_LableModel
             .select(Discussion_LableModel.label_id, fn.COUNT(Discussion_LableModel.discussion_id).alias('discussion_count'))
             .join(LabelModel)
             .group_by(Discussion_LableModel.label_id))
    
    label_counts = []
    for result in query:
        label = result.label_id.toLabel().__dict__
        label['discussion_count'] = result.discussion_count
        label_counts.append(label)
    return jsonify(label_counts)
    
@app.route('/discussions', methods=['GET'])
def get_discussion():
    page = request.args.get('page', default=1, type=int)
    paginate_by = request.args.get('paginate_by', default=10, type=int)
    label_id = request.args.get('label_id', default=None, type=int)
    if label_id:
        query = (DiscussionModel
                 .select()
                 .join(Discussion_LableModel)
                 .where(Discussion_LableModel.label_id == label_id)
                 .paginate(page, paginate_by))
        page_num = ceil((DiscussionModel
                 .select()
                 .join(Discussion_LableModel)
                 .where(Discussion_LableModel.label_id == label_id)).count() / paginate_by)
    else:
        query = (DiscussionModel
                 .select()
                 .join(Discussion_LableModel)
                 .paginate(page, paginate_by))
        page_num = ceil((DiscussionModel
                 .select()
                 .join(Discussion_LableModel)).count() / paginate_by)
    resp = {
        'page_num': page_num,
        'discussions': []
    }
    for discussion_model in query:
        discussion=discussion_model.toDiscussion()
        discussion.body = discussion.body[:100]
        discussion_labels = discussion_model.discussion_labels
        for label in discussion_labels:
            discussion.labels.append(label.label_id.toLabel().__dict__)
        resp['discussions'].append(discussion.__dict__)
    return jsonify(resp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)