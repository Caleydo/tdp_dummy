/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, categoricalCol, numberCol2} from '../targid2/LineUpView';


export class AStart extends ALineUpView {
  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    //TODO
    this.build();
  }

  private build() {
    //generate random data
    this.setBusy(true);
    Promise.all([ajax.getAPIJSON('/targid/dummy/a/desc'), ajax.getAPIJSON('/targid/dummy/a')]).then((args) => {
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
      lineup.data.deriveDefault();
      lineup.update();
      this.setBusy(false);
    });
  }
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
    Promise.all([ajax.getAPIJSON('/targid/dummy/b/desc'), ajax.getAPIJSON('/targid/dummy/b')]).then((args) => {
      const desc = args[0];
      const rows : any[] = args[1];
      const columns = [
        stringCol('b_name','Name'),
        categoricalCol('b_cat1', desc.columns.a_cat1.categories),
        categoricalCol('b_cat2', desc.columns.a_cat2.categories),
        numberCol2('b_int', desc.columns.a_int.min, desc.columns.a_int.max),
        numberCol2('b_real', desc.columns.a_real.min, desc.columns.a_real.max),
      ];
      var lineup = this.buildLineUp(rows, columns, idtypes.resolve(desc.idType),(d) => d._id);
      lineup.data.deriveDefault();
      lineup.update();
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

