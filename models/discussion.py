import os
import json

class Discussion:
    id = 0
    title = ""
    created_at = ""
    updated_at = ""
    body = ""
    labels = []
    
    @staticmethod
    def fromEnv():
        discussion = Discussion()
        for key, _ in discussion.__dict__.items():
            if key== "labels":
                discussion.__dict__[key] = json.loads(os.environ.get(key.upper()))
            elif key== "id":
                discussion.__dict__[key] = int(os.environ.get("NUMBER"))
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

class DiscussionModel(Model):
    id = IntegerField(primary_key=True)
    title = CharField()
    created_at = CharField()
    updated_at = CharField()
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
    
    def toDiscussion(self):
        discussion = Discussion()
        for key, _ in discussion.__dict__.items():
                discussion.__dict__[key] = self.__dict__[key]
        return discussion
    
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s