from models.discussion import Discussion, DiscussionModel,DiscussionIndex
from models.discussion_label import Discussion_Label, Discussion_LableModel
from exts import db
import os

if __name__ == "__main__":
    db.create_tables([DiscussionModel, DiscussionIndex, Discussion_LableModel])
    # db.create_tables([DiscussionModel, Discussion_LableModel])
    discussion = Discussion.fromEnv()
    discussion_labels = Discussion_Label.fromEnv()
    print(f"discussion: {discussion}\n discussion_labels: {discussion_labels}")
    action = os.environ.get("ACTION")
    if action == "deleted":
        DiscussionModel.delete_by_id(discussion.id)
    elif action == "created":
        DiscussionModel.create(**discussion.__dict__)
        discussion_lables = [ {"discussion_id":discussion.id,"label_id":lable_id} for lable_id in discussion.labels ]
        Discussion_LableModel.insert_many(discussion_lables).execute()
    elif action == "edited":
        DiscussionModel.set_by_id(discussion.id, **discussion.__dict__)
    elif action == "labeled":
        Discussion_LableModel.delete().where(Discussion_LableModel.discussion_id == discussion.id).execute()
        discussion_lables = [ {"discussion_id":discussion.id,"label_id":lable_id} for lable_id in discussion.labels ]
        Discussion_LableModel.insert_many(discussion_lables).execute()
    else: # unlabeled
        Discussion_LableModel.delete().where(Discussion_LableModel.discussion_id == discussion.id).execute()
        discussion_lables = [ {"discussion_id":discussion.id,"label_id":lable_id} for lable_id in discussion.labels ]
        Discussion_LableModel.insert_many(discussion_lables).execute()
    # DiscussionIndex.rebuild()
    # DiscussionIndex.optimize()
    db.close()