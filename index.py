from flask import Flask, jsonify, request
from models.article import ArticleModel
from models.article_label import Article_LableModel
from models.lable import LabelModel
from peewee import fn,JOIN
from math import ceil
from utils.flask import JsonResponse

app = Flask(__name__)

@app.route('/', methods=['GET'])
def hello():
    return jsonify({'message': 'Hello, World!'})

@app.route('/labels', methods=['GET'])
def get_labels():
    query = (Article_LableModel
             .select(Article_LableModel.label_id, fn.COUNT(Article_LableModel.article_id).alias('article_count'))
             .join(LabelModel)
             .group_by(Article_LableModel.label_id))
    
    label_counts = []
    for result in query:
        label = result.label_id.toLabel().__dict__
        label['article_count'] = result.article_count
        label_counts.append(label)
    return JsonResponse.success(label_counts)
    
@app.route('/articles', methods=['GET'])
def get_articles():
    page = request.args.get('page', default=1, type=int)
    paginate_by = request.args.get('paginate_by', default=10, type=int)
    label_id = request.args.get('label_id', default=None, type=int)
    if label_id:
        query = (ArticleModel
                 .select()
                 .join(Article_LableModel,JOIN.LEFT_OUTER)
                 .where(Article_LableModel.label_id == label_id)
                 .paginate(page, paginate_by))
        page_num = ceil((ArticleModel
                 .select()
                 .join(Article_LableModel,JOIN.LEFT_OUTER)
                 .where(Article_LableModel.label_id == label_id)).count() / paginate_by)
    else:
        query = (ArticleModel
                 .select()
                 .join(Article_LableModel,JOIN.LEFT_OUTER)
                 .paginate(page, paginate_by))
        page_num = ceil((ArticleModel
                 .select()
                 .join(Article_LableModel,JOIN.LEFT_OUTER)).count() / paginate_by)
    resp = {
        'page_num': page_num,
        'articles': []
    }
    for article_model in query:
        article = article_model.toArticle(limit=True)
        resp['articles'].append(article.__dict__)
    return JsonResponse.success(resp)

@app.route('/article/<int:article_id>', methods=['GET'])
def get_article(article_id):
    article_model = ArticleModel.get(ArticleModel.id == article_id)
    article = article_model.toArticle()
    return JsonResponse.success(article.__dict__)


if __name__ == '__main__':
    app.run(debug=True, port=5000)