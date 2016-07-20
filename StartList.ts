/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import d3 = require('d3');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, categoricalCol, numberCol2, useDefaultLayout} from '../targid2/LineUpView';
import {gene_species} from './Configs';
import {listNamedSets} from '../targid2/storage';
import {IPluginDesc} from '../caleydo_core/plugin';


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
 * Create a list for main navigation from all species and LineUp named sets (aka stored LineUp sessions)
 * @param parent
 * @param desc
 * @param options
 * @returns {function(): any}
 */
export function createStartAFactory(parent: HTMLElement, desc: IPluginDesc, options:any) {
  const $parent = d3.select(parent);

  // read species
  const data = gene_species.map((d) => ({ type: 'cat', v: d}));
  data.unshift({type: 'all', v: 'All'});

  // load named sets (stored LineUp sessions)
  listNamedSets('IDTypeA').then((l) => {
    // convert to data format
    data.push.apply(data, l.map((d) => ({ type: 'set', v: d.name, ids: d.ids})));

    // append the list items
    const $ul = $parent.append('ul');
    const $options = $ul.selectAll('li').data(data);
    $options.enter()
      .append('li')
      //.classed('selected', (d,i) => (i === 0))
      .append('a')
      .attr('href', '#')
      .text((d:any) => d.v.charAt(0).toUpperCase() + d.v.slice(1))
      .on('click', (d:any) => {
        // prevent changing the hash (href)
        (<Event>d3.event).preventDefault();

        // if targid object is available
        if(options.targid) {
          // create options for new view
          let o = {};
          if(d.type === 'cat') {
            o = { cat: d.v};
          } else if(d.type === 'set') {
            o = { filterName: d.name, filter: d.ids};
          }
          // push new view with options to targid
          options.targid.push((<any>desc).viewId, null, null, o);
        } else {
          console.error('no targid object given to push new view');
        }
      });
  });
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

