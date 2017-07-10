import {getAPIJSON} from 'phovea_core/src/ajax';
import {IDummyDataSource, dataSourceA, dataSourceB} from '../Configs';

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

  search(query: string, page: number, pageSize: number): Promise<{ more: boolean, results: IResult[] }> {
    return getAPIJSON(`/targid/db/dummy/${this.dataSource.table}_items/lookup`, {
      column: 'name',
      query,
      page: page + 1, //required to start with 1 instead of 0
      limit: pageSize
    }).then((data) => {
      return {
        results: data.items.map((d) => Object.assign(d, {id: d.targidid, extra: d.id})),
        more: data.more
      };
    });
  }


  validate(query: string[]): Promise<IResult[]> {
    //TODO
    return Promise.resolve([]);
  }
}


export function createA() {
  return new DummySearchProvider(dataSourceA);
}

export function createB() {
  return new DummySearchProvider(dataSourceB);
}
