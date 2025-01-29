import os

class Label:
    def __init__(self):
        self.id = 0
        self.name = ""
        self.color = ""
    
    @staticmethod
    def fromEnv():
        label = Label()
        for key, _ in label.__dict__.items():
            label.__dict__[key] = os.environ.get(key.upper())
        return label
    
    def __str__(self):
        s=""
        for key, value in self.__dict__.items():
            s += f"{key}: {value}\n"
        return s
    
from peewee import *
from exts import db

class LabelModel(Model):
    id = IntegerField(primary_key=True)
    name = CharField()
    color = CharField()
    
    class Meta:
        database = db
        table_name = 'labels'
        
    @staticmethod
    def fromLabel(label):
        label_model = LabelModel()
        for attr in label.__dict__.keys():
            setattr(label_model, attr, getattr(label, attr))
        return label_model
    
    def toLabel(self):
        label = Label()
        for key, _ in label.__dict__.items():
                label.__dict__[key] = getattr(self, key)
        return label

    