import json
import os

class Discussion_Label:
    discussion_id = 0
    label_id = 0
    
    @staticmethod
    def fromEnv():
        discussion_id = os.environ.get("NUMBER")
        lables = json.loads(os.environ.get("LABELS"))
        discussion_labels = []
        for label in lables:
            discussion_labels.append(Discussion_Label(discussion_id, label))
        return discussion_labels
    
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s
    
from peewee import *
from exts import db
from models.discussion import DiscussionModel
from models.lable import LabelModel

class Discussion_LableModel(Model):
    discussion_id = ForeignKeyField(DiscussionModel, backref='discussion_labels')
    label_id = ForeignKeyField(LabelModel, backref='discussion_labels')
    
    class Meta:
        database = db
        table_name = 'discussion_labels'
        
    @staticmethod
    def fromDiscussion_Label(discussion_label):
        discussion_label_model = Discussion_LableModel()
        for attr in discussion_label.__dict__.keys():
            setattr(discussion_label_model, attr, getattr(discussion_label, attr))
        return discussion_label_model
    
    def toDiscussion_Label(self):
        discussion_label = Discussion_Label()
        for key, _ in discussion_label.__dict__.items():
                discussion_label.__dict__[key] = self.__dict__[key]
        return discussion_label
    
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s