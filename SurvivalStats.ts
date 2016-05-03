/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';
import {alteration_types} from './Configs';

export class SurvivalStats extends AView {

  private x = d3.scale.linear();
  private y = d3.scale.linear();
  private xAxis = d3.svg.axis().orient('bottom').scale(this.x);

  private parameter = {
    alteration_type: alteration_types[0]
  };

  private line = d3.svg.line().interpolate('step')
      .x((d) => this.x(d[0]))
      .y((d) => this.y(d[1]));

  constructor(context:IViewContext, private selection:ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('survival-stats', true);

    this.build();
    this.update();
  }

  private build() {
    //TODO build kaplan maier plots
    const left = this.$node.append('div').classed('left', true);
    left.append('span').text('Having Alteration Type');
    this.buildKM(left);
    const right = this.$node.append('div').classed('right', true);
    right.append('span').text('Not Having Alteration Type');
    this.buildKM(right);
  }

  private buildKM($parent: d3.Selection<any>) {

    const margin = {top: 10, right: 10, bottom: 30, left: 10},
      width = 400 - margin.left - margin.right,
      height = 420 - margin.top - margin.bottom;

    var svg = $parent.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.range([0, width]);
    this.y.range([0, height]);

    svg.append('path').classed('km', true);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');
  }

  private updateChart(rows_yes: number[], rows_no: number[]) {
    this.x.domain([0, d3.max(rows_yes.concat(rows_no))]);

    const left = this.$node.select('div.left');
    left.select('span').text('Having Alteration Type ' + rows_yes.length);
    this.updateKM(left, rows_yes);
    const right = this.$node.select('div.right');
    right.select('span').text('Not Having Alteration Type '+rows_no.length);
    this.updateKM(right, rows_no);
  }

  private updateKM($parent: d3.Selection<any>, rows: number[]) {
    const svg = $parent.select('svg g');

    svg.select('g.x.axis').call(this.xAxis);

    const died = rows.filter((a) => !isNaN(a)).map((a) => Math.abs(a));
    died.sort(d3.ascending);
    //const alive = arr.length - died.length;

    this.y.domain([0, rows.length]);

    //0 ... 100%
    var points = [[0, 0]],
      prev_i = 0;
    for (let i = 1; i < died.length; ++i) {
      while(died[i] === died[i-1] && i < died.length) {
        ++i;
      }
      points.push([died[prev_i], prev_i + 1]);
      prev_i = i;
    }
    if (died.length > 0) {
      points.push([died[prev_i], prev_i + 1]);
    }
    points.push([this.x.domain()[1], died.length]);
    svg.select('path.km').datum(points).attr('d', this.line);
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
      this.updateChart(yes.map((d) => d.b_int), no.map((d) => d.b_int));
      this.setBusy(false);
    });
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new SurvivalStats(context, selection, parent, options);
}


