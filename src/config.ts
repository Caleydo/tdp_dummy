/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

export const categories = ['ACat 1', 'ACat 2', 'ACat 3'];
export const types = ['ABCat 1', 'ABCat 2', 'ABCat 3'];
export const samples = ['BCatB 1', 'BCatB 2', 'BCatB 3', 'BCatB 4', 'BCatB 5'];


/**
 * List of ids for parameter form elements
 * Reuse this ids and activate the `useSession` option for form elements to have the same selectedIndex between different views
 */
//TODO simplify by using unique prefix to avoid collisions
export class ParameterFormIds {
  static SAMPLE = 'dummySample';
  static TYPE = 'dummyType';

  static SCORE_ATTRIBUTE = 'dummyAttr';
  static SCORE_AGGREGATION = 'dummyAggregation';
}


export interface IDummyDataSource {
  name: string;
  idType: string;
  table: string;
}

export const dataSourceA: IDummyDataSource = {
  name: 'a',
  idType: 'IDTypeA',
  table: 'a'
};

export const dataSourceB: IDummyDataSource = {
  name: 'b',
  idType: 'IDTypeB',
  table: 'b'
};
