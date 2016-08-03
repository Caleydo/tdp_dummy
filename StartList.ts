/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, categoricalCol, numberCol2, useDefaultLayout} from '../targid2/LineUpView';
import {gene_species} from './Configs';
import {IPluginDesc} from '../caleydo_core/plugin';
import {IEntryPointList, AEntryPointList} from '../targid2/StartMenu';


export class AStart extends ALineUpView {
  private cat : string = null;

  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.cat = options && options.cat ? options.cat : null;
    this.build();
  }

  private build() {
    //generate random data
    this.setBusy(true);
    const data = this.cat === null ? ajax.getAPIJSON('/targid/db/dummy/a'): ajax.getAPIJSON('/targid/db/dummy/a_filtered', {cat : this.cat});
    Promise.all([ajax.getAPIJSON('/targid/db/dummy/a/desc'), data]).then((args) => {
      const desc = args[0];
      const rows : any[] = args[1];
      const columns = [
        stringCol('a_name','Name'),
        categoricalCol('a_cat1', desc.columns.a_cat1.categories),
        categoricalCol('a_cat2', desc.columns.a_cat2.categories),
        numberCol2('a_int', desc.columns.a_int.min, desc.columns.a_int.max),
        numberCol2('a_real', desc.columns.a_real.min, desc.columns.a_real.max),
      ];
      var lineup = this.buildLineUp(rows, columns, idtypes.resolve(desc.idType),(d) => d._id);
      useDefaultLayout(lineup);
      this.initializedLineUp();
      this.setBusy(false);
    });
  }
}


/**
 * Entry point list from all species and LineUp named sets (aka stored LineUp sessions)
 */
class DummyEntryPointList extends AEntryPointList {

  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(protected parent: HTMLElement, protected desc: IPluginDesc, protected options:any) {
    super(parent, desc, options);

    this.idType = 'IDTypeA';

    // read species
    this.data = gene_species.map((d) => ({ type: 'cat', v: d}));
    this.data.unshift({type: 'all', v: 'All'});

    this.build();
  }
}

/**
 * Create a list for main navigation from all species and LineUp named sets (aka stored LineUp sessions)
 * @param parent
 * @param desc
 * @param options
 * @returns {function(): any}
 */
export function createStartAFactory(parent: HTMLElement, desc: IPluginDesc, options:any):IEntryPointList {
  return new DummyEntryPointList(parent, desc, options);
}

export class BStart extends ALineUpView {
  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    //TODO
    this.build();
  }

  private build() {
    //generate random data
    this.setBusy(true);
    Promise.all([ajax.getAPIJSON('/targid/db/dummy/b/desc'), ajax.getAPIJSON('/targid/db/dummy/b')]).then((args) => {
      const desc = args[0];
      const rows : any[] = args[1];
      const columns = [
        stringCol('b_name','Name'),
        categoricalCol('b_cat1', desc.columns.b_cat1.categories),
        categoricalCol('b_cat2', desc.columns.b_cat2.categories),
        numberCol2('b_int', desc.columns.b_int.min, desc.columns.b_int.max),
        numberCol2('b_real', desc.columns.b_real.min, desc.columns.b_real.max),
      ];
      var lineup = this.buildLineUp(rows, columns, idtypes.resolve(desc.idType),(d) => d._id);
      useDefaultLayout(lineup);
      this.initializedLineUp();
      this.setBusy(false);
    });
  }
}

export function createStartA(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new AStart(context, selection, parent, options);
}

export function createStartB(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new BStart(context, selection, parent, options);
}

