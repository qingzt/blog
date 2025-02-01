from flask import Flask, jsonify, request
from models.article import ArticleModel, ArticleIndex
from models.article_label import Article_LableModel
from models.lable import LabelModel
from peewee import fn,JOIN
from math import ceil
from utils.flask import JsonResponse

app = Flask(__name__)
app.json.ensure_ascii = False

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
                 .order_by(ArticleModel.updated_at.desc()))
        label = LabelModel.get(LabelModel.id == label_id).toLabel().__dict__
    else:
        query = (ArticleModel
                 .select()
                 .order_by(ArticleModel.updated_at.desc()))
        label = None
    page_num = ceil(query.count() / paginate_by)
    query = query.paginate(page, paginate_by)
    resp = {
        'page_num': page_num,
        'articles': [],
        'label': label
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

@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('query')
    page = request.args.get('page', default=1, type=int)
    paginate_by = request.args.get('paginate_by', default=10, type=int)
    docs = ArticleIndex.search(query).paginate(page, paginate_by)
    resp = {
        'page_num': ceil(docs.count() / paginate_by),
        'articles': []
    }
    for doc in docs:
        article = ArticleModel.get(ArticleModel.id == doc.rowid).toArticle(limit=True)
        resp['articles'].append(article.__dict__)
    return JsonResponse.success(resp)

if __name__ == '__main__':
    app.run(debug=True, port=5000)