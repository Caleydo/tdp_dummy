from phovea_server.config import view
from targid2.dbview import DBViewBuilder


__author__ = 'Samuel Gratzl'
cc = view('targid_dummy')

idtype_a = 'IDTypeA'
idtype_b = 'IDTypeB'

_index = '(t.rowid-1) as _index'
agg_score = DBViewBuilder().query('%(agg)s(%(score)s)').replacement('agg').replacement('score').build()

_column_query_a = 'cast(id as text) as id, a_name, a_cat1, a_cat2, a_int, a_real'
_column_query_b = 'cast(id as text) as id, b_name, b_cat1, b_cat2, b_int, b_real'

views = dict(
  a=DBViewBuilder()
    .idtype(idtype_a)
    .query("""
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

  a_namedset=DBViewBuilder()
    .idtype(idtype_a)
    .query("""
SELECT {index}, {columns}
FROM a t WHERE id IN (:ids)""".format(index=_index, columns=_column_query_a))
    .arg('ids').build(),

  a_filtered=DBViewBuilder()
    .idtype(idtype_a)
    .query("""
SELECT {index}, {columns}
FROM a t WHERE a_cat1 = :cat""".format(index=_index, columns=_column_query_a))
    .arg('cat').build(),

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

  score=DBViewBuilder()
    .idtype(idtype_a)
    .query("""
SELECT cast(a_id as text) as id, %(agg_score)s as score
FROM ab INNER JOIN b ON b.id = ab.b_id
WHERE b.b_cat2 = :b_cat2 GROUP BY ab.a_id""")
    .replace('agg').replace('score').replace('agg_score')
    .arg('b_cat2').build(),

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


def create():
  return dict(agg_score=agg_score, views=views, mapping={})
