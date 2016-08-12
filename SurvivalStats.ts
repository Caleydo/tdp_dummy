/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {IViewContext, ISelection, ASmallMultipleView} from '../targid2/View';
import {alteration_types} from './Configs';
import {FormBuilder, FormElement, IFormSelectDesc} from '../targid2/FormBuilder';
import {ParameterFormIds} from '../targid_celllinedb/Common';

class SurvivalStats extends ASmallMultipleView {

  private x = d3.scale.linear();
  private y = d3.scale.linear();

  private xAxis = d3.svg.axis().orient('bottom').scale(this.x);
  private yAxis = d3.svg.axis().orient('left').scale(this.y).tickFormat((d) => (100-d*100).toString()).ticks(10);

  private paramForm:FormBuilder;
  private paramDesc:IFormSelectDesc[] = [
    {
      type: FormElement.SELECT,
      label: 'Alteration Type',
      id: ParameterFormIds.ALTERATION_TYPE,
      options: {
        options: alteration_types,
        useSession: true
      }
    }
  ];

  private line = d3.svg.line().interpolate('step')
      .x((d) => this.x(d[0]))
      .y((d) => this.y(d[1]));

  constructor(context:IViewContext, private selection:ISelection, parent:Element, options?) {
    super(context, selection, parent, options);
  }

  init() {
    super.init();
    this.$node.classed('survival-stats', true);
    this.update();
  }

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any)=>Promise<any>) {
    this.paramForm = new FormBuilder($parent);

    // map FormElement change function to provenance graph onChange function
    this.paramDesc.forEach((p) => {
      p.options.onChange = (selection, formElement) => onChange(formElement.id, selection.value);
    });

    this.paramForm.build(this.paramDesc);

    // add other fields
    super.buildParameterUI($parent.select('form'), onChange);
  }

  getParameter(name: string): any {
    return this.paramForm.getElementById(name).value.data;
  }

  setParameter(name: string, value: any) {
    this.paramForm.getElementById(name).value = value;
    this.update(true);
  }

  changeSelection(selection:ISelection) {
    this.selection = selection;
    this.update();
  }

  private update(updateAll = false) {
    this.setBusy(true);

    const that = this;
    const ids = this.selection.range.dim(0).asList();
    const idtype = this.selection.idtype;

    const data:IDataFormat[] = ids.map((id) => {
      return {id: id, rows_yes: [], rows_no: []};
    });

    const $ids = this.$node.selectAll('div.ids').data<IDataFormat>(<any>data, (d) => d.id.toString());
    const $ids_enter = $ids.enter().append('div').classed('ids', true);

    // decide whether to load data for newly added items
    // or to reload the data for all items (e.g. due to parameter change)
    const enterOrUpdateAll = (updateAll) ? $ids : $ids_enter;

    enterOrUpdateAll.each(function(d) {
      const $id = d3.select(this);

      return that.resolveId(idtype, d.id, 'IDTypeA')
        .then((name) => {
          return ajax.getAPIJSON('/targid/db/dummy/survival_stats', {
            a_id: name
          });
        })
        .then((rows) => {
          d.rows_yes = rows
            .filter((d) => d.ab_cat === that.getParameter(ParameterFormIds.ALTERATION_TYPE))
            .map((d) => d.b_int);

          d.rows_no = rows
            .filter((d) => d.ab_cat !== that.getParameter(ParameterFormIds.ALTERATION_TYPE))
            .map((d) => d.b_int);

          that.initChart($id);
          that.updateChartData($id);

          that.setBusy(false);
        });
    });

    $ids.exit().remove()
      .each(function(d) {
        that.setBusy(false);
      });
  }

  private initChart($parent) {
    // already initialized svg node -> skip this part
    if($parent.select('svg').size() > 0) {
      return;
    }

    const svg = $parent.append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

    this.x.range([0, this.width]);
    this.y.range([0, this.height]);

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + this.height + ')');

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(0,0)');

    svg.append('text')
      .attr('class', 'x label')
      .attr('text-anchor', 'start')
      .attr('x', 20)
      .attr('y', this.height - 6)
      .text('Time in months');

    svg.append('text')
      .attr('class', 'y label')
      .attr('text-anchor', 'start')
      .attr('x', -this.width+35)
      .attr('y', 6)
      .attr('dy', '.75em')
      .attr('transform', 'rotate(-90)')
      .text('Survival in %');

    svg.append('text')
      .attr('class', 'path label having')
      .attr('text-anchor', 'end')
      .attr('x', this.width);

    svg.append('text')
      .attr('class', 'path label nothaving')
      .attr('text-anchor', 'end')
      .attr('x', this.width)
      .attr('dy', '1.25em');
  }

  private updateChartData($parent) {

    const data:IDataFormat = $parent.datum();
    const rows_yes = data.rows_yes;
    const rows_no = data.rows_no;

    this.x.domain([0, d3.max(rows_yes.concat(rows_no))]);

    this.updateKM($parent, [rows_yes, rows_no]);
  }

  private updateKM($parent: d3.Selection<any>, rows: number[][]) {
    const svg = $parent.select('svg g');

    svg.select('text.having').text(this.getParameter(ParameterFormIds.ALTERATION_TYPE));
    svg.select('text.nothaving').text('NOT ' + this.getParameter(ParameterFormIds.ALTERATION_TYPE));

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
    $points.select('title').text((d,i) => i === 0 ? this.getParameter(ParameterFormIds.ALTERATION_TYPE) : 'NOT ' + this.getParameter(ParameterFormIds.ALTERATION_TYPE));
    $points.exit().remove();
  }

}

interface IDataFormat {
  id: number;
  rows_yes: number[];
  rows_no: number[];
}

export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new SurvivalStats(context, selection, parent, options);
}


