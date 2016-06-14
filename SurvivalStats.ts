/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';
import {alteration_types} from './Configs';
import {random_id} from '../caleydo_core/main';

export class SurvivalStats extends AView {

  private x = d3.scale.linear();
  private y = d3.scale.linear();

  private xAxis = d3.svg.axis().orient('bottom').scale(this.x);
  private yAxis = d3.svg.axis().orient('left').scale(this.y).tickFormat((d) => (100-d*100).toString()).ticks(10);

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
    const margin = {top: 10, right: 10, bottom: 30, left: 30},
      width = 330 - margin.left - margin.right,
      height = 320 - margin.top - margin.bottom;

    var svg = this.$node.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.range([0, width]);
    this.y.range([0, height]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,0)');

    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'start')
      .attr('x', 20)
      .attr('y', height - 6)
      .text('Time in months');

    svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'start')
      .attr('x', -width+35)
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Survival in %');

    svg.append('text')
      .attr('class', 'path label having')
      .attr('text-anchor', 'end')
      .attr('x', width);

    svg.append('text')
      .attr('class', 'path label nothaving')
      .attr('text-anchor', 'end')
      .attr('x', width)
      .attr('dy', '1.25em');
  }

  private updateChart(rows_yes: number[], rows_no: number[]) {
    this.x.domain([0, d3.max(rows_yes.concat(rows_no))]);

    this.updateKM(this.$node, [rows_yes, rows_no]);
  }

  private updateKM($parent: d3.Selection<any>, rows: number[][]) {
    const svg = $parent.select('svg g');

    svg.select('text.having').text(this.parameter.alteration_type);
    svg.select('text.nothaving').text('NOT ' + this.parameter.alteration_type);

    svg.select('g.x.axis').call(this.xAxis);
    svg.select('g.y.axis').call(this.yAxis);

    this.y.domain([0, 1]);
    const toPoints = (row: number[]) => {
      const died = row.filter((a) => !isNaN(a)).map((a) => Math.abs(a));
      died.sort(d3.ascending);
      const l = row.length;
      //const alive = arr.length - died.length;

      //0 ... 100%
      var points = [[0, 0]],
        prev_i = 0;
      for (let i = 1; i < died.length; ++i) {
        while(died[i] === died[i-1] && i < died.length) {
          ++i;
        }
        points.push([died[prev_i], (prev_i + 1)/l]);
        prev_i = i;
      }
      if (died.length > 0) {
        points.push([died[prev_i], (prev_i + 1)/l]);
      }
      points.push([this.x.domain()[1], died.length/l]);
      return points;
    };
    const points = rows.map(toPoints);
    const $points = svg.selectAll('path.km').data(points);
    $points.enter().append('path').classed('km', true).append('title');
    $points.attr('d', this.line).classed('having',(d,i)=>i === 0);
    $points.select('title').text((d,i) => i === 0 ? this.parameter.alteration_type : 'NOT ' + this.parameter.alteration_type);
    $points.exit().remove();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    const id = random_id();
    const $group1 = $parent.append('div').classed('form-group', true);
    $group1.append('label').attr('for', 'alternationType_' + id).text('Alteration Type ');
    const $select = $group1.append('select').attr('id', 'alternationType_' + id).attr({
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


