import {IDummyDataSource, dataSourceA, dataSourceB} from '../config';
import {getTDPLookup, getTDPFilteredRows} from 'tdp_core/src/rest';
import '../style.scss';

export interface IResult {
  readonly id: string;
  readonly text: string;
}

export interface ISearchProvider {
  search(query: string, page: number, pageSize: number): Promise<{ more: boolean, results: IResult[] }>;

  validate(query: string[]): Promise<IResult[]>;

  format?(item: IResult): string;
}

export default class DummySearchProvider implements ISearchProvider {

  constructor(private readonly dataSource: IDummyDataSource) {

  }

  private static fixIds(item: any) {
    item.extra = item.id;
    item.id = item._id;
    return item;
  }

  search(query: string, page: number, pageSize: number): Promise<{ more: boolean, results: IResult[] }> {
    return getTDPLookup('dummy', `${this.dataSource.table}_items`, {
      column: `${this.dataSource.table}_name`,
      query,
      page: page + 1, //required to start with 1 instead of 0
      limit: pageSize
    }, true).then((data) => {
      return {
        results: data.items.map(DummySearchProvider.fixIds),
        more: data.more
      };
    });
  }

  validate(query: string[]): Promise<IResult[]> {
    return getTDPFilteredRows('dummy', `${this.dataSource.table}_items_verify`, {}, {
      [`${this.dataSource.table}_name`]: query
    }, true).then((r) => r.map(DummySearchProvider.fixIds));
  }
}


export function createA() {
  return new DummySearchProvider(dataSourceA);
}

export function createB() {
  return new DummySearchProvider(dataSourceB);
}
