/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, numberCol2, useDefaultLayout} from '../targid2/LineUpView';
import {alteration_types} from './Configs';

export class Enrichment extends ALineUpView {

  private lineupPromise : Promise<any>;

  private parameter = {
    alteration_type: alteration_types[0]
  };

  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);

    this.build();
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    $parent.classed('hidden', false);
    $parent.append('span').text('Alteration Type ');
    const $select = $parent.append('select').attr({
      'class': 'form-control',
      required: 'required'
    }).on('change', function() {
      onChange('alteration_type', alteration_types[this.selectedIndex]);
    });
    $select.selectAll('option').data(alteration_types)
      .enter().append('option').text(String).attr('value', String);
    $select.property('selectedIndex', alteration_types.indexOf(this.parameter.alteration_type));
  }

  getParameter(name: string): any {
    return this.parameter[name];
  }

  setParameter(name: string, value: any) {
    this.parameter[name] = value;
    return this.update();
  }

  changeSelection(selection: ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    const id = this.selection.range.first;
    const idtype = this.selection.idtype;
    this.setBusy(true);
    return Promise.all([this.lineupPromise, this.resolveId(idtype, id, 'IDTypeA')]).then((args) => {
      const gene_name = args[1];
      return ajax.getAPIJSON('/targid/db/dummy/model_systems', {
        a_id: gene_name,
        ab_cat: this.parameter.alteration_type
      });
    }).then((rows) => {
      this.replaceLineUpData(rows);
      this.setBusy(false);
    });
  }

  private build() {
    //generate random data
    this.setBusy(true);
    const columns = [
      stringCol('b_name','Name'),
      numberCol2('ab_real', -1, 1),
    ];
    var lineup = this.buildLineUp([], columns, idtypes.resolve('IDTypeB'),(d) => d._id);
    useDefaultLayout(lineup);
    this.setBusy(false);

    this.lineupPromise = Promise.resolve(lineup);
  }
}
export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new Enrichment(context, selection, parent, options);
}


