/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {AStartList, IViewContext, ISelection} from 'tdp_core/src/views';
import {IDummyDataSource, dataSourceA, dataSourceB} from '../config';
import {getTDPDesc, getTDPFilteredRows} from 'tdp_core/src/rest';


class DummyStartList extends AStartList {
  constructor(context: IViewContext, private readonly dataSource: IDummyDataSource, selection: ISelection, parent: HTMLElement, options = {}) {
    super(context, selection, parent, Object.assign({
      itemName: dataSource.name,
      itemIDType: dataSource.idType
    }, options));
  }

  protected loadColumnDesc() {
    return getTDPDesc('dummy', this.dataSource.table);
  }

  protected loadRows() {
    const filters = this.buildNamedSetFilters('namedset4id');
    return getTDPFilteredRows('dummy', this.dataSource.table, {}, filters);
  }
}

export function createStartA(context: IViewContext, selection: ISelection, parent: HTMLElement, options?) {
  return new DummyStartList(context, dataSourceA, selection, parent, options);
}

export function createStartB(context: IViewContext, selection: ISelection, parent: HTMLElement, options?) {
  return new DummyStartList(context, dataSourceB, selection, parent, options);
}

