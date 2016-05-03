/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';
import {alteration_types} from './Configs';

export class SurvivalStats extends AView {

  private parameter = {
    alteration_type: alteration_types[0]
  };

  constructor(context:IViewContext, private selection:ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('survival-stats', true);

    this.build();
    this.update();
  }

  private build() {
    //TODO build kaplan maier plots
    this.$node.append('div').classed('left', true).text('Having Alteration Type');
    this.$node.append('div').classed('right', true).text('Not Having Alteration Type');
  }


  private updateChart(rows_yes: number[], rows_no: number[]) {
    this.$node.select('div.left').text('Having Alteration Type ' + rows_yes.length);
    this.$node.select('div.right').text('Not Having Alteration Type '+rows_no.length);
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    $parent.append('span').text('alteration type ');
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

  changeSelection(selection:ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    const id = this.selection.range.first;
    const idtype = this.selection.idtype;
    this.setBusy(true);
    return this.resolveId(idtype, id, 'IDTypeA').then((name) => {
      return ajax.getAPIJSON('/targid/db/dummy/survival_stats', {
        a_id: name
      });
    }).then((rows) => {
      const yes = rows.filter((d) => d.ab_cat === this.parameter.alteration_type);
      const no = rows.filter((d) => d.ab_cat !== this.parameter.alteration_type);
      this.updateChart(yes, no);
      this.setBusy(false);
    });
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new SurvivalStats(context, selection, parent, options);
}


