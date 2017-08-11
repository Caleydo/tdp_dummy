# flake8: noqa
from phovea_server.config import view
from ordino.dbview import DBViewBuilder, DBConnector, add_common_queries, append_where

__author__ = 'Samuel Gratzl'
cc = view('targid_dummy')

idtype_a = 'IDTypeA'
idtype_b = 'IDTypeB'

agg_score = DBViewBuilder().query('{agg}({score})').replace('agg').replace('score').build()

def _create(result, prefix, idtype, other_prefix):
  columns = [prefix + '_name', prefix + '_cat1', prefix + '_cat2', prefix + '_int', prefix + '_real']
  other_columns = [other_prefix + '_name', other_prefix + '_cat1', other_prefix + '_cat2', other_prefix + '_int', other_prefix + '_real']

  add_common_queries(result, prefix, idtype, 'cast(id as text) as id', columns)

  result[prefix + '_score'] = DBViewBuilder().idtype(idtype).query("""
    SELECT cast(e.{table}_id as text) as id, {{agg_score}} AS score
    FROM ab e
    JOIN {table} t ON e.{table}_id = t.id
    JOIN {other_table} s ON s.id = e.{other_table}_id
    {{where}}
    GROUP BY internal_id, t.name""".format(table=prefix, other_table=other_prefix))\
    .replace('where').replace('agg_score').replace('data_subtype', ['ab_real', 'ab_int']) \
    .filters(*other_columns) \
    .filter('rid', alias='t.' + prefix +'_name') \
    .filter('name', alias='s.' + other_prefix + '_name') \
    .filter('id', table='t') \
    .build()

  result[prefix + '_single_score'] = DBViewBuilder().idtype(idtype).query("""
    SELECT cast(e.{table}_id as text) as id, {{attribute}} AS score
    FROM ab e
    JOIN {table} t ON e.{table}_id = t.id
    JOIN {other_table} s ON s.id = e.{other_table}_id
    WHERE e.{other_table}_id = :name""".format(table=prefix, other_table=other_prefix))\
    .arg('name')\
    .replace('attribute', ['ab_real', 'ab_int', 'ab_cat'])\
    .call(append_where) \
    .filters(*other_columns) \
    .filter('rid', alias = 't.' + prefix +'_name') \
    .filter('id', table = 't') \
    .build()

views = dict(
  dummy_detail=DBViewBuilder().idtype(idtype_b).query("""
SELECT cast(a1.b_id as text) as id, a1.ab_real as value1, a2.ab_real as value2
FROM ab a1 INNER JOIN ab a2 ON a1.b_id = a2.b_id
WHERE a1.a_id = :a_id1 and a2.a_id = :a_id2""")
    .arg('a_id1').arg('a_id2')
    .build()
)
_create(views, 'a', idtype_a, 'b')
_create(views, 'b', idtype_b, 'a')



def create():
  from os import path
  connector = DBConnector(agg_score, views)
  connector.dburl = 'sqlite:///' + path.abspath(path.dirname(__file__)+'/ab.sqlite')
  return connector
