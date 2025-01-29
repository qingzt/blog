from models.discussion import Discussion, DiscussionModel
from models.discussion_label import Discussion_Label, Discussion_LableModel
from exts import db
import os

if __name__ == "__main__":
    db.create_tables([DiscussionModel, Discussion_LableModel])
    discussion = Discussion.fromEnv()
    discussion_labels = Discussion_Label.fromEnv()
    print(f"discussion: {discussion}\n discussion_labels: {discussion_labels}")
    action = os.environ.get("ACTION")
    if action == "deleted":
        num_rows = DiscussionModel.delete().where(DiscussionModel.id == discussion.id).execute()
        num_rows += Discussion_LableModel.delete().where(Discussion_LableModel.discussion_id == discussion.id).execute()
        print(f"Delete {num_rows} rows")
    else:
        discussion_model = DiscussionModel.fromDiscussion(discussion)
        num_rows = discussion_model.save(force_insert=True)
        for discussion_label in discussion_labels:
            discussion_label_model = Discussion_LableModel.fromDiscussion_Label(discussion_label)
            num_rows += discussion_label_model.save(force_insert=True)
        print(f"Update {num_rows} rows")
    db.close()