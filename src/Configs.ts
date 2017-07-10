/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {stringCol, categoricalCol, numberCol2} from 'ordino/src/LineUpView';


export const categories = ['ACat 1', 'ACat 2', 'ACat 3'];
export const types = ['ABCat 1', 'ABCat 2', 'ABCat 3'];
export const samples = ['BCatB 1', 'BCatB 2', 'BCatB 3', 'BCatB 4', 'BCatB 5'];


/**
 * List of ids for parameter form elements
 * Reuse this ids and activate the `useSession` option for form elements to have the same selectedIndex between different views
 */
export class ParameterFormIds {
  static SAMPLE = 'dummySample';
  static TYPE = 'dummyType';

  static SCORE_ATTRIBUTE = 'dummyAttr';
  static SCORE_AGGREGATION='dummyAggregation';
}


export interface IDummyDataSource {
  name: string;
  table: string;
  columns(desc: any) :any[];
}

export const dataSourceA : IDummyDataSource = {
  name: 'a',
  table: 'a',
  columns: (desc) => [
    stringCol('a_name', 'Name'),
    categoricalCol('a_cat1', desc.columns.a_cat1.categories),
    categoricalCol('a_cat2', desc.columns.a_cat2.categories),
    numberCol2('a_int', desc.columns.a_int.min, desc.columns.a_int.max),
    numberCol2('a_real', desc.columns.a_real.min, desc.columns.a_real.max)
  ]
};

export const dataSourceB : IDummyDataSource = {
  name: 'b',
  table: 'b',
  columns: (desc) => [
    stringCol('b_name', 'Name'),
    categoricalCol('b_cat1', desc.columns.b_cat1.categories),
    categoricalCol('b_cat2', desc.columns.b_cat2.categories),
    numberCol2('b_int', desc.columns.b_int.min, desc.columns.b_int.max),
    numberCol2('b_real', desc.columns.b_real.min, desc.columns.b_real.max),
  ]
};
