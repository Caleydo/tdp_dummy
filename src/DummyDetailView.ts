/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
import './style.scss';
import * as ajax from 'phovea_core/src/ajax';
import {AView, IViewContext, ISelection} from 'targid2/src/View';
import {showErrorModalDialog} from 'targid2/src/Dialogs';
import * as d3 from 'd3';

class DummyDetailView extends AView {

  private x = d3.scale.linear();
  private y = d3.scale.linear();
  private xAxis = d3.svg.axis().orient('bottom').scale(this.x);
  private yAxis = d3.svg.axis().orient('left').scale(this.y);


  constructor(context:IViewContext, private selection:ISelection, parent:Element, options?) {
    super(context, parent, options);
    this.$node.classed('dummy-detail', true);

    this.build();
    this.update();
  }

  private build() {

    const margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    const svg = this.$node.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.range([0, width]);
    this.y.range([height, 0]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')');
    svg.append('g')
      .attr('class', 'y axis');
  }


  private updateChart(gene1: string, gene2: string, rows: {value1: number, value2: number}[]) {
    this.x.domain(d3.extent(rows, (d) => d.value1));
    this.y.domain(d3.extent(rows, (d) => d.value2));

    const svg = this.$node.select('svg g');

    svg.select('g.x.axis').call(this.xAxis);
    svg.select('g.y.axis').call(this.yAxis);

    const marks = svg.selectAll('.mark').data(rows);
    marks.enter().append('circle').classed('mark', true).attr('r', 5);

    marks.transition().attr({
      cx : (d) => this.x(d.value1),
      cy : (d) => this.y(d.value2),
    });

    marks.exit().remove();

  }

  changeSelection(selection:ISelection) {
    this.selection = selection;
    return this.update();
  }

  private update() {
    const idtype = this.selection.idtype;
    this.setBusy(true);
    let names: string[] = null;
    const promise = this.resolveIds(idtype, this.selection.range, 'IDTypeA')
      .then((_names) => {
        names = _names;
        return <Promise<{value1: number, value2: number}[]>>ajax.getAPIJSON('/targid/db/dummy/dummy_detail', {
          a_id1: _names[0],
          a_id2: _names[1]
        });
      });

    // on success
    promise.then((rows) => {
      this.updateChart(names[0], names[1], rows);
      this.setBusy(false);
    });

    // on error
    promise.catch(showErrorModalDialog)
      .catch((error) => {
        console.error(error);
        this.setBusy(false);
      });

    return promise;
  }
}


export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new DummyDetailView(context, selection, parent, options);
}


