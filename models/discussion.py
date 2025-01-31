import os
import json
from datetime import datetime

from utils.markdown import unmark

class Discussion:
    def __init__(self):
        self.id = 0
        self.title = ""
        self.created_at = ""
        self.updated_at = ""
        self.body = ""
        self.labels = []
    
    @staticmethod
    def fromEnv():
        discussion = Discussion()
        for key, _ in discussion.__dict__.items():
            if key== "labels":
                discussion.__dict__[key] = json.loads(os.environ.get(key.upper()))
            elif key== "id":
                discussion.__dict__[key] = int(os.environ.get("NUMBER"))
            elif key == "created_at" or key == "updated_at":
                discussion.__dict__[key] = datetime.strptime(os.environ.get(key.upper()), "%Y-%m-%dT%H:%M:%SZ")
            else:
                discussion.__dict__[key] = os.environ.get(key.upper())
        return discussion
        
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s
    
from peewee import *
from exts import db
from playhouse.sqlite_ext import FTSModel,SearchField

class DiscussionModel(Model):
    id = IntegerField(primary_key=True)
    title = TextField()
    created_at = DateTimeField()
    updated_at = DateTimeField()
    body = TextField()
    
    class Meta:
        database = db
        table_name = 'discussions'
        
    @staticmethod
    def fromDiscussion(discussion):
        discussion_model = DiscussionModel()
        for attr in discussion.__dict__.keys():
            setattr(discussion_model, attr, getattr(discussion, attr))
        return discussion_model
    
    def toDiscussion(self,limit=False):
        discussion = Discussion()
        for key, _ in discussion.__dict__.items():
            if key == "labels":
                continue
            discussion.__dict__[key] = getattr(self, key)
        if limit:
            discussion.body = unmark(discussion.body)[:300]
        if hasattr(self, 'discussion_labels'):
            discussion_labels = self.discussion_labels
            for label in discussion_labels:
                discussion.labels.append(label.label_id.toLabel().__dict__)
        return discussion
        

class DiscussionIndex(FTSModel):
    title = SearchField()
    body = SearchField()
    
    class Meta:
        database = db
        table_name = 'discussion_index'
        options = {'content': DiscussionModel, 'tokenize': 'porter'}