import {IDummyDataSource, dataSourceA, dataSourceB} from './config';
import {getTDPLookup, getTDPFilteredRows} from 'tdp_core/src/rest';
import './style.scss';
import {IResult, ISearchProvider} from 'tdp_core/src/public/search';

export default class DummySearchProvider implements ISearchProvider {

  constructor(private readonly dataSource: IDummyDataSource) {

  }

  search(query: string, page: number, pageSize: number) {
    return getTDPLookup('dummy', `${this.dataSource.table}_items`, {
      column: `${this.dataSource.table}_name`,
      query,
      page,
      limit: pageSize
    });
  }

  validate(query: string[]): Promise<IResult[]> {
    return <Promise<IResult[]>>getTDPFilteredRows('dummy', `${this.dataSource.table}_items_verify`, {}, {
      [`${this.dataSource.table}_name`]: query
    });
  }
}


export function createA() {
  return new DummySearchProvider(dataSourceA);
}

export function createB() {
  return new DummySearchProvider(dataSourceB);
}
