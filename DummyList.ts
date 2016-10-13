/**
 * Created by Samuel Gratzl on 29.01.2016.
 */

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView2, stringCol, categoricalCol, numberCol2} from '../targid2/LineUpView';
import {INamedSet} from '../targid2/storage';
import {FormBuilder} from '../targid2/FormBuilder';

interface IDummyDataSource {
  name: string;
  table: string;
  columns(desc: any) :any[];
}

const dataSourceA : IDummyDataSource = {
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

const dataSourceB : IDummyDataSource = {
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


class DummyStartList extends ALineUpView2 {
  /**
   * Initialize LineUp view with named set
   * Override in constructor of extended class
   */
  private namedSet: INamedSet;

  /**
   * Parameter UI form
   */
  private paramForm: FormBuilder;

  constructor(context: IViewContext, private dataSource: IDummyDataSource, selection: ISelection, parent: Element, options?) {
    super(context, selection, parent, options);
    this.namedSet = options.namedSet;
    this.build();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    this.paramForm = new FormBuilder($parent);

    const paramConfig = [];

    //add configuration options

    this.paramForm.build(paramConfig);

    // add other fields
    super.buildParameterUI($parent.select('form'), onChange);
  }

  getParameter(name: string): any {
    return this.paramForm.getElementById(name).value.data;
  }

  setParameter(name: string, value: any) {
    this.paramForm.getElementById(name).value = value;
    this.clear();
    return this.update();
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
    return ajax.getAPIJSON(`/targid/db/dummy/${this.dataSource.table}/desc`);
  }

  protected initColumns(desc) {
    super.initColumns(desc);

    const columns = this.dataSource.columns(desc);

    this.build([], columns);
    return columns;
  }

  protected loadRows() {
    const namedSetIdUrl = (this.namedSet.id) ? `/namedset/${this.namedSet.id}` : '';
    const param = {};
    var filteredUrl = '';

    if (this.namedSet.subTypeKey && this.namedSet.subTypeKey !== '' && this.namedSet.subTypeValue !== 'all') {
      param[this.namedSet.subTypeKey] = this.namedSet.subTypeValue;
      filteredUrl = '_filtered';
    }

    const baseURL = `/targid/db/dummy/${this.dataSource.table}_${filteredUrl}${namedSetIdUrl}`;
    return ajax.getAPIJSON(baseURL, param);
  }

  getItemName(count) {
    return (count === 1) ? this.dataSource.name: this.dataSource.name + 's';
  }
}

export function createStartA(context: IViewContext, selection: ISelection, parent: Element, options?) {
  return new DummyStartList(context, dataSourceA, selection, parent, options);
}

export function createStartB(context: IViewContext, selection: ISelection, parent: Element, options?) {
  return new DummyStartList(context, dataSourceB, selection, parent, options);
}

