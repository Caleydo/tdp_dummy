/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, categoricalCol, numberCol2} from '../targid2/LineUpView';

export class ABDependent extends ALineUpView {
  static OPERATORS = ['<', '>', '<=', '>=', '=', '<>'];

  private lineupPromise : Promise<any>;

  private parameter = {
    operator: '<',
    value: 0
  };

  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);

    this.build();
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    $parent.append('span').text('criteria ab_real ');
    const $select = $parent.append('select').attr({
      'class': 'form-control',
      required: 'required'
    }).on('change', function() {
      onChange('operator', ABDependent.OPERATORS[this.selectedIndex]);
    });
    $select.selectAll('option').data(ABDependent.OPERATORS)
      .enter().append('option').text(String).attr('value', String);
    $select.property('selectedIndex', ABDependent.OPERATORS.indexOf(this.parameter.operator));
    $parent.append('input').attr({
      'class': 'form-control',
      required: 'required',
      type: 'number',
      step: 'any',
      value: this.parameter.value
    }).on('change', function() {
      onChange('value', +this.value);
    });
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
      return ajax.getAPIJSON('/targid/dummy/ab', {
        name: gene_name,
        value: this.parameter.value,
        op: this.parameter.operator
      });
    }).then((rows) => {
      this.replaceLineUpData(rows);
      this.setBusy(false);
    });
  }

  private build() {
    //generate random data
    this.setBusy(true);
    this.lineupPromise = ajax.getAPIJSON('/targid/dummy/ab/desc').then((desc) => {
      const columns = [
        stringCol('b_name','Name'),
        categoricalCol('b_cat1', desc.columns.b_cat1.categories),
        numberCol2('ab_real', desc.columns.ab_real.min, desc.columns.ab_real.max),
      ];
      var lineup = this.buildLineUp([], columns, idtypes.resolve(desc.idType),(d) => d._id);
      lineup.data.deriveDefault();
      lineup.update();
      this.setBusy(false);
    });
  }
}
export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new ABDependent(context, selection, parent, options);
}


