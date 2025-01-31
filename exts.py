from playhouse.sqlite_ext import SqliteExtDatabase
db = SqliteExtDatabase('blog.db', pragmas=(('foreign_keys', 1),))
db.load_extension('libsimple/libsimple')