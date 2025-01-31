import json
import os

class Article_Label:
    def __init__(self, article_id=0, label_id=0):
        self.article_id = article_id
        self.label_id = label_id
    
    @staticmethod
    def fromEnv():
        article_id = os.environ.get("NUMBER")
        lables = json.loads(os.environ.get("LABELS"))
        article_labels = []
        for label in lables:
            article_labels.append(Article_Label(article_id, label))
        return article_labels
    
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s
    
from peewee import *
from exts import db
from models.article import ArticleModel
from models.lable import LabelModel

class Article_LableModel(Model):
    article_id = ForeignKeyField(ArticleModel, backref='article_labels',on_delete='CASCADE')
    label_id = ForeignKeyField(LabelModel, backref='article_labels', on_delete='CASCADE')
    
    class Meta:
        database = db
        table_name = 'article_labels'
        primary_key = CompositeKey('article_id', 'label_id')
        
    @staticmethod
    def fromArticle_Label(article_label):
        article_label_model = Article_LableModel()
        for attr in article_label.__dict__.keys():
            setattr(article_label_model, attr, getattr(article_label, attr))
        return article_label_model
    
    def toArticle_Label(self):
        article_label = Article_Label()
        for key, _ in article_label.__dict__.items():
                article_label.__dict__[key] = getattr(self, key)
        return article_label