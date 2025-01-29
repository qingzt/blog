from models.lable import Label, LabelModel
from exts import db
import os

if __name__ == "__main__":
    db.create_tables([LabelModel])
    label = Label.fromEnv()
    print(label)
    action = os.environ.get("ACTION")
    if action == "deleted":
        num_rows = LabelModel.delete().where(LabelModel.id == label.id).execute()
        print(f"Delete {num_rows} rows")
    else:
        label_model = LabelModel.fromLabel(label)
        num_rows = label_model.save(force_insert=True)
        print(f"Update {num_rows} rows")
    