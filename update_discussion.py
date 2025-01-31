from models.article import Article, ArticleModel,ArticleIndex
from models.article_label import Article_Label, Article_LableModel
from exts import db
import os

if __name__ == "__main__":
    db.create_tables([ArticleModel, ArticleIndex, Article_LableModel])
    db.execute_sql("CREATE TRIGGER IF NOT EXISTS articles_after_insert AFTER INSERT ON articles \
        BEGIN \
            INSERT INTO article_index(docid, title, body) \
            VALUES (NEW.id, NEW.title, NEW.body); \
        END;")
    db.execute_sql("CREATE TRIGGER IF NOT EXISTS articles_after_update AFTER UPDATE ON articles \
        BEGIN \
            UPDATE article_index SET title=NEW.title, body=NEW.body WHERE docid=NEW.id; \
        END;")
    db.execute_sql("CREATE TRIGGER IF NOT EXISTS articles_after_delete AFTER DELETE ON articles \
        BEGIN \
            DELETE FROM article_index WHERE docid=OLD.id; \
        END;")
    article = Article.fromEnv()
    article_labels = Article_Label.fromEnv()
    print(f"article: {article}\n article_labels: {article_labels}")
    action = os.environ.get("ACTION")
    if action == "deleted":
        ArticleModel.delete_by_id(article.id)
    elif action == "created":
        ArticleModel.create(**article.__dict__)
        article_lables = [ {"article_id":article.id,"label_id":lable_id} for lable_id in article.labels ]
        Article_LableModel.insert_many(article_lables).execute()
    elif action == "edited":
        ArticleModel.set_by_id(article.id, article.getSetDict())
    elif action == "labeled":
        Article_LableModel.delete().where(Article_LableModel.article_id == article.id).execute()
        article_lables = [ {"article_id":article.id,"label_id":lable_id} for lable_id in article.labels ]
        Article_LableModel.insert_many(article_lables).execute()
    else: # unlabeled
        Article_LableModel.delete().where(Article_LableModel.article_id == article.id).execute()
        article_lables = [ {"article_id":article.id,"label_id":lable_id} for lable_id in article.labels ]
        Article_LableModel.insert_many(article_lables).execute()
    db.close()