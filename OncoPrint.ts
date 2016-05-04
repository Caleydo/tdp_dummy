/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';
import {sample_tumor_type, alteration_types} from './Configs';

export class OncoPrint extends AView {

  private x = d3.scale.ordinal<number>();
  private y = d3.scale.ordinal<number>();
  private c = d3.scale.category10().domain(alteration_types);
  private yAxis = d3.svg.axis().orient('left').scale(this.y);

  private parameter = {
    tumor_type: sample_tumor_type[0]
  };

  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);

    this.build();
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    $parent.append('span').text('tumor type ');
    const $selectType = $parent.append('select').attr({
      'class': 'form-control',
      required: 'required'
    }).on('change', function() {
      onChange('tumor_type', sample_tumor_type[this.selectedIndex]);
    });
    $selectType.selectAll('option').data(sample_tumor_type)
      .enter().append('option').text(String).attr('value', String);
    $selectType.property('selectedIndex', sample_tumor_type.indexOf(this.parameter.tumor_type));

  }

  getParameter(name: string): any {
    return this.parameter[name];
  }

  setParameter(name: string, value: any) {
    this.parameter[name] = value;
    return this.update();
  }

  private build() {

    const margin = {top: 10, right: 30, bottom: 10, left: 50},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = this.$node.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.rangeRoundBands([0, width]);
    this.y.rangeRoundBands([height, 0]);

    svg.append('g')
      .attr('class', 'y axis');
  }


  private updateChart(rows: {a_name: string, b_name: string, ab_cat: string}[]) {
    this.x.domain(rows.map((d) => d.b_name));
    this.y.domain(rows.map((d) => d.a_name));

    const data = d3.nest().key((d:any) => d.a_name).entries(rows);

    const svg = this.$node.select('svg g');

    svg.select('g.y.axis').call(this.yAxis);

    const marks = svg.selectAll('.row').data(data);
    marks.enter().append('g').classed('row', true);
    marks.attr('transform', (d) => `translate(0,${this.y(d.key)})`);
    const cells = marks.selectAll('.cell').data((d) => d.values);
    cells.enter().append('rect').classed('cell', true);
    cells.attr({
      width: this.x.rangeBand(),
      height: this.y.rangeBand()
    }).attr('x', (d:any) => this.x(d.b_name))
      .style('fill',(d: any) => this.c(d.ab_cat));
    cells.exit().remove();

    marks.exit().remove();
  }

  changeSelection(selection:ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    const idtype = this.selection.idtype;
    this.setBusy(true);
    return this.resolveIds(idtype, this.selection.range, 'IDTypeA').then((names) => {
      return ajax.getAPIJSON('/targid/db/dummy/onco_print', {
        a_ids: names.join(','),
        b_cat2 : this.parameter.tumor_type
      });
    }).then((rows) => {
      this.updateChart(rows);
      this.setBusy(false);
    });
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new OncoPrint(context, selection, parent, options);
}


