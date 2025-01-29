from models.lable import Label, LabelModel
from exts import db

if __name__ == "__main__":
    db.create_tables([LabelModel])
    label = Label.fromEnv()
    print(label)
    label_model = LabelModel.fromLabel(label)
    num_rows = label_model.save(force_insert=True)
    print(f"Update {num_rows} rows")