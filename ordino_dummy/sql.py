# flake8: noqa
from phovea_server.config import view
from ordino.dbview import DBViewBuilder, DBConnector

__author__ = 'Samuel Gratzl'
cc = view('targid_dummy')

idtype_a = 'IDTypeA'
idtype_b = 'IDTypeB'

_index = '(t.rowid-1) as _index'
agg_score = DBViewBuilder().query('%(agg)s(%(score)s)').replace('agg').replace('score').build()

_column_query_a = 'cast(id as text) as id, a_name, a_cat1, a_cat2, a_int, a_real'
_column_query_b = 'cast(id as text) as id, b_name, b_cat1, b_cat2, b_int, b_real'

def _create_base(result, prefix, idtype):

  result[prefix + '_items'] = DBViewBuilder().idtype(idtype).query("""
      SELECT cast(id as text) as id, %(column)s AS text
      FROM {table} WHERE LOWER(%(column)s) LIKE :query
      ORDER BY %(column)s ASC LIMIT %(limit)s OFFSET %(offset)s""".format(table=prefix))\
    .replace("column").replace("limit").replace("offset")\
    .arg("query").build()

  result[prefix+'_items_verify'] = DBViewBuilder().idtype(idtype).query("""
      SELECT cast(id as text) as id, name AS text
      FROM {table} %(where)s""".format(table=prefix))\
    .replace("where").build()

  result[prefix + '_unique'] = DBViewBuilder().query("""
        SELECT d as id, d as text
        FROM (
          SELECT distinct %(column)s AS d
          FROM {table} WHERE LOWER(%(column)s) LIKE :query
          ) as t
        ORDER BY d ASC LIMIT %(limit)s OFFSET %(offset)s""".format(table=prefix)) \
    .replace("column").replace("limit").replace("offset") \
    .arg("query").build()

  result[prefix + '_unique_all'] = DBViewBuilder().query("""
        SELECT distinct %(column)s AS text
        FROM {table} ORDER BY %(column)s ASC """.format(table=prefix)) \
    .replace("column").build()


def _create(result, prefix, idtype, other_prefix):
  _create_base(result, prefix, idtype)
  result[prefix + '_score'] = DBViewBuilder().idtype(idtype).query("""
    SELECT cast(e.{table}_id as text) as internal_id, p.name AS id, %(agg_score)s AS score
    FROM ab e
    JOIN {table} p ON e.{table}_id = p.id
    JOIN {other_table} s ON s.id = e.{other_table}_id
    %(where)s
    GROUP BY internal_id, p.name""".format(table=prefix, other_table=other_prefix))\
    .replace('where').replace('agg_score').replace('data_subtype')\
    .query('filter_rid', 'p.name %(operator)s %(value)s') \
    .query('filter_name', 's.name %(operator)s %(value)s') \
    .query('filter_id', 'p.id %(operator)s %(value)s') \
    .build()

  result[prefix + '_single_score'] = DBViewBuilder().idtype(idtype).query("""
    SELECT p.name AS id, %(attribute)s AS score
    FROM ab e
    JOIN {table} p ON e.{table}_id = p.id
    WHERE e.{other_table}_id = :id %(and_where)s""".format(table=prefix, other_table=other_prefix))\
    .arg('id').replace('attribute').replace('and_where') \
    .query('filter_rid', 'p.name %(operator)s %(value)s') \
    .query('filter_id', 'p.id %(operator)s %(value)s') \
    .build()

views = dict(
  a=DBViewBuilder().idtype(idtype_a).query("""
  SELECT {index}, {columns} FROM a t""".format(index=_index, columns=_column_query_a))
    .query_stats("""
SELECT min(a_int) as a_int_min, max(a_int) as a_int_max, min(a_real) as a_real_min, max(a_real) as a_real_max FROM a""")
    .query_categories("""
SELECT distinct %(col)s as cat FROM a WHERE %(col)s is not null AND %(col)s <> ''""")
    .column('a_name', type='string')
    .column('a_cat1', type='categorical')
    .column('a_cat2', type='categorical')
    .column('a_int', type='number')
    .column('a_real', type='number')
    .build(),

  b=DBViewBuilder()
    .idtype(idtype_b)
    .query("""
SELECT {index}, {columns} FROM a t""".format(index=_index, columns=_column_query_b))
    .query_stats("""
SELECT min(b_int) as b_int_min, max(b_int) as b_int_max, min(b_real) as b_real_min, max(b_real) as b_real_max FROM b""")
    .query_categories("""
SELECT distinct %(col)s as cat FROM b WHERE %(col)s is not null AND %(col)s <> ''""")
    .column('b_name', type='string')
    .column('b_cat1', type='categorical')
    .column('b_cat2', type='categorical')
    .column('b_int', type='number')
    .column('b_real', type='number')
    .build(),

  dummy_detail=DBViewBuilder()
    .idtype(idtype_b)
    .query("""
SELECT cast(a1.b_id as text) as id, a1.ab_real as value1, a2.ab_real as value2
FROM ab a1 INNER JOIN ab a2 ON a1.b_id = a2.b_id
WHERE a1.a_id = :a_id1 and a2.a_id = :a_id2""")
    .arg('a_id1').arg('a_id2').build(),

  dummy_dependent=DBViewBuilder()
    .idtype(idtype_a)
    .query("""
SELECT cast(a.id as text) as id, a_name, max(ab_int) as score
FROM ab INNER JOIN a ON a.id = ab.a_id INNER JOIN  b ON b.id = ab.b_id
WHERE ab.ab_cat = :ab_cat AND b.b_cat2 = :b_cat2 AND ab_int > (select max(ab_int) FROM ab INNER JOIN b ON b.id = ab.b_id
WHERE ab.ab_cat = :ab_cat AND b.b_cat2 = :b_cat2 AND ab.a_id = :a_id)
GROUP BY a.id""")
    .arg('a_id').arg('ab_cat').arg('b_cat2').build()
)
_create(views, 'a', idtype_a, 'b')
_create(views, 'b', idtype_b, 'a')



def create():
  from os import path
  connector = DBConnector(agg_score, views)
  connector.dburl = 'sqlite:///' + path.abspath(path.dirname(__file__)+'/ab.sqlite')
  return connector
