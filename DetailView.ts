/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';

export class DummyHistogram extends AView {
  private x = d3.scale.linear();
  private y = d3.scale.linear();
  private xAxis = d3.svg.axis()
      .orient('bottom');

  constructor(context:IViewContext, selection:ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('dummy-histogram', true);

    this.build();
    this.changeSelection(selection);
  }

  private build() {
    //http://bl.ocks.org/mbostock/3048450

    var margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = this.$node.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.range([0, width]);
    this.xAxis.scale(this.x);

    this.y.range([height, 0]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');
  }

  private updateChart(rows: number[]) {
    this.x.domain(d3.extent(rows));


    // Generate a histogram using twenty uniformly-spaced bins.
    const data = d3.layout.histogram().bins(this.x.ticks(20))(rows);

    this.y.domain([0, d3.max(data, (d) => d.y)]);

    const svg = this.$node.select('svg g');

    const bar = svg.selectAll('.bar')
      .data(data);

    const bar_enter = bar
      .enter().append('g')
      .attr('class', 'bar');

    bar_enter.append('rect')
      .attr('x', 1);

    bar_enter.append('text')
      .attr('dy', '.75em')
      .attr('y', 6)
      .attr('text-anchor', 'middle');

    bar.transition().attr('transform', (d) => {
        return 'translate(' + this.x(d.x) + ',' + this.y(d.y) + ')';
      });

    bar.select('rect').transition()
      .attr('width', this.x(data[0].dx) - 1)
      .attr('height', (d) => this.y.range()[0] - this.y(d.y));

    const formatCount = d3.format(',.0f');

    bar.select('text').transition()
      .attr('x', this.x(data[0].dx) / 2)
      .text(function (d) {
        return formatCount(d.y);
      });

    bar.exit().remove();

    svg.select('g.x.axis').call(this.xAxis);

  }

  changeSelection(selection:ISelection) {
    const id = selection.range.first;
    const idtype = selection.idtype;
    this.setBusy(true);
    return this.resolveId(idtype, id, 'IDTypeA').then((name) => {
      return ajax.getAPIJSON('/targid/db/dummy/ab_values/raw/value', {
        a_id: name
      });
    }).then((rows) => {
      this.updateChart(rows);
      this.setBusy(false);
    });
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new DummyHistogram(context, selection, parent, options);
}


