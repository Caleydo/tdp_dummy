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
  //private c = d3.scale.category10().domain(alteration_types);
  private c = d3.scale.ordinal<string>().domain(["ABCat 1", "ABCat 2", "ABCat 3"]).range(["#d3d3d3", "#0000ff","#ff0000"]);
  private cMut = d3.scale.ordinal<string>().domain(["ABCat 1", "ABCat 2", "ABCat 3"]).range(["#008000", "#9f8170","#000000"]);
  private cBor = d3.scale.ordinal<string>().domain(["ABCat 2", "ABCat 3"]).range(["#ff0000","#0000ff"]);
  private yAxis = d3.svg.axis().orient('left').scale(this.y);

  private cellHeight = 25;
  private cellWidth = 7;
  private cellPadding = 3;
  private cellMutation = 5;

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

    console.log(data);

    const svg = this.$node.select('svg g');

    svg.select('g.y.axis').call(this.yAxis);

    // data binding
    const marks = svg.selectAll('.row').data(data);

    // enter
    marks.enter()
      .append('g').classed('row', true)
      .append('text');

    // update
    marks.attr('transform', (d) => `translate(0,${this.y(d.key)})`);
    marks.select('text').text((d:any) => d.key);

    const cells = marks.selectAll('.cell').data((d) => d.values);
    cells.enter().append('rect')
      .classed('cell', true)
      .attr({
        width: this.cellWidth,
        height: this.cellHeight,
      });
    cells.attr('x', (d:any, i:number) => (this.cellWidth + this.cellPadding) * i) //(d:any) => this.x(d.b_name)
      .style('fill', (d:any) => this.c(d.ab_cat))
      .style('stroke', (d:any) => this.cBor(d.ab_cat));
    cells.exit().remove();


    const muts = marks.selectAll('.mut').data((d) => d.values);
    muts.enter().append('rect')
      .classed('mut', true)
      .attr({
        width: this.cellWidth,
        height: this.cellMutation,
        y: 10,
      });
    muts.attr('x', (d:any, i) => (this.cellWidth + this.cellPadding) * i)
      .style('fill', (d:any) => this.cMut(d.ab_cat));
    muts.exit().remove();


    // exit
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


