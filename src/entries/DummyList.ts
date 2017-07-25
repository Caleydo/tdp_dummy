/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import {getAPIJSON} from 'phovea_core/src/ajax';
import {IViewContext, ISelection} from 'ordino/src/View';
import {ALineUpView2} from 'ordino/src/LineUpView';
import {ENamedSetType, INamedSet} from 'ordino/src/storage';
import {IDummyDataSource, dataSourceA, dataSourceB} from '../Configs';
import {mixin} from 'phovea_core/src';


class DummyStartList extends ALineUpView2 {
  /**
   * Initialize LineUp view with named set
   * Override in constructor of extended class
   */
  private namedSet: INamedSet;

  constructor(context: IViewContext, private dataSource: IDummyDataSource, selection: ISelection, parent: Element, options?) {
    super(context, selection, parent, options);
    this.namedSet = options.namedSet;
  }

  protected extraComputeScoreParam(): any {
    return this.namedSet;
  }

  /**
   * Get sub type for named sets
   * @returns {{key: string, value: string}}
   */
  protected getSubType() {
    return {
      key: this.namedSet.subTypeKey,
      value: this.namedSet.subTypeValue
    };
  }

  protected loadColumnDesc() {
    return getAPIJSON(`/targid/db/dummy/${this.dataSource.table}/desc`);
  }

  protected initColumns(desc) {
    super.initColumns(desc);

    const columns = this.dataSource.columns(desc);

    this.build([], columns);
    return columns;
  }
  protected loadRows() {
    const param: any = {
      _assignids : true //assign globally ids on the server side
    };
    if(this.namedSet) {
      switch(this.namedSet.type) {
        case ENamedSetType.NAMEDSET:
          param.filter_namedset4id = this.namedSet.id;
          break;
        case ENamedSetType.FILTER:
          mixin(param, this.namedSet.filter);
      }
    }
    return getAPIJSON(`/targid/db/dummy/${this.dataSource.table}/filter`, param);
  }

  getItemName(count: number) {
    return (count === 1) ? this.dataSource.name: this.dataSource.name + 's';
  }
}

export function createStartA(context: IViewContext, selection: ISelection, parent: Element, options?) {
  return new DummyStartList(context, dataSourceA, selection, parent, options);
}

export function createStartB(context: IViewContext, selection: ISelection, parent: Element, options?) {
  return new DummyStartList(context, dataSourceB, selection, parent, options);
}

