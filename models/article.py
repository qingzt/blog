import os
import json
from datetime import datetime

from utils.markdown import unmark

class Article:
    def __init__(self):
        self.id = 0
        self.title = ""
        self.created_at = ""
        self.updated_at = ""
        self.body = ""
        self.labels = []
    
    @staticmethod
    def fromEnv():
        article = Article()
        for key, _ in article.__dict__.items():
            if key== "labels":
                article.__dict__[key] = json.loads(os.environ.get(key.upper()))
            elif key== "id":
                article.__dict__[key] = int(os.environ.get("NUMBER"))
            elif key == "created_at" or key == "updated_at":
                article.__dict__[key] = datetime.strptime(os.environ.get(key.upper()), "%Y-%m-%dT%H:%M:%SZ")
            else:
                article.__dict__[key] = os.environ.get(key.upper())
        return article
        
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s
    
    def getSetDict(self):
        dict=self.__dict__
        dict.pop("id")
        dict.pop("labels")
        return dict
    
from peewee import *
from exts import db
from playhouse.sqlite_ext import FTSModel,SearchField

class ArticleModel(Model):
    id = IntegerField(primary_key=True)
    title = TextField()
    created_at = DateTimeField()
    updated_at = DateTimeField()
    body = TextField()
    
    class Meta:
        database = db
        table_name = 'articles'
        
    @staticmethod
    def fromArticle(article):
        article_model = ArticleModel()
        for attr in article.__dict__.keys():
            setattr(article_model, attr, getattr(article, attr))
        return article_model
    
    def toArticle(self,limit=False):
        article = Article()
        for key, _ in article.__dict__.items():
            if key == "labels":
                continue
            article.__dict__[key] = getattr(self, key)
        if limit:
            article.body = unmark(article.body)[:300]
        if hasattr(self, 'article_labels'):
            article_labels = self.article_labels
            for label in article_labels:
                article.labels.append(label.label_id.toLabel().__dict__)
        return article
        

class ArticleIndex(FTSModel):
    title = SearchField()
    body = SearchField()
    
    class Meta:
        database = db
        table_name = 'article_index'
        options = {'content': ArticleModel, 'tokenize': 'porter'}