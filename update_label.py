from models.lable import Label, LabelModel
from exts import db
import os

if __name__ == "__main__":
    db.create_tables([LabelModel])
    label = Label.fromEnv()
    print(label)
    action = os.environ.get("ACTION")
    if action == "deleted":
        LabelModel.delete().where(LabelModel.id == label.id).execute()
    elif action == "created":
        LabelModel.create(**label.__dict__)
    else: # edited
        LabelModel.set_by_id(label.id, **label.__dict__)
    db.close()
    