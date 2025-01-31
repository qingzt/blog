from playhouse.sqlite_ext import SqliteDatabase
db = SqliteDatabase('blog.db', pragmas=(('foreign_keys', 1),))