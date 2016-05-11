/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, categoricalCol, numberCol2, useDefaultLayout, booleanCol} from '../targid2/LineUpView';
import {gene_species} from './Configs';
import {listNamedSets} from '../targid2/storage';


export class AStart extends ALineUpView {
  private filter = ranges.Range1D.none();
  private filterName = 'F';
  private cat : string = null;

  constructor(context:IViewContext, selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.filter = (options && options.filter ? ranges.parse(options.filter) : ranges.none()).dim(0);
    this.filterName = options && options.filterName ? options.filterName : 'F';
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
      if (!this.filter.isNone && !this.filter.isAll) {
        columns.splice(1, 0, booleanCol('_checked', this.filterName));
        rows.forEach((row) => row._checked = this.filter.contains(row._id));
      }
      var lineup = this.buildLineUp(rows, columns, idtypes.resolve(desc.idType),(d) => d._id);
      useDefaultLayout(lineup);
      if (!this.filter.isNone && !this.filter.isAll) {
        //activate the filter to be just the checked ones
        const f = lineup.data.getRankings()[0].flatColumns.filter((col) => col.desc.type === 'boolean' && col.desc.column === '_checked')[0];
        if (f) {
          f.setFilter(true);
        }
      }
      this.setBusy(false);
    });
  }
}

export function createStartAFactory(parent: HTMLElement) {
  const $parent = d3.select(parent);
  const data = gene_species.map((d) => ({ type: 'cat', v: d}));
  data.unshift({type: 'all', v: 'All'});
  var current = null;
  listNamedSets('IDTypeA').then((l) => {
    data.push.apply(data, l.map((d) => ({ type: 'set', v: d.name, ids: d.ids})));
    const $options = $parent.selectAll('div.radio').data(data);
    $options.enter().append('div').classed('radio', true)
      .html((d,i) => `<label><input type="radio" name="geneSpecies" value="${d.v}" ${i === 0 ? 'checked' : ''}>${d.v}</label>`)
      .select('input').on('change', (d) => current = d);
  });
  function buildOptions(): any {
    if (current === null || current.type === 'all') {
      return {};
    }
    if (current.type === 'cat') {
      return { cat: current.v};
    }
    return { filterName: current.name, filter: current.ids};
  }
  return () => buildOptions();
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

