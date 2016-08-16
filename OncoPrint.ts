/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {IViewContext, ISelection, ASmallMultipleView} from '../targid2/View';
import {sample_tumor_type, ParameterFormIds} from './Configs';
import {FormBuilder, FormElementType, IFormSelectDesc} from '../targid2/FormBuilder';

export class OncoPrint extends ASmallMultipleView {

  private x = d3.scale.ordinal<number>();
  private y = d3.scale.ordinal<number>();
  //private c = d3.scale.category10().domain(alteration_types);
  private c = d3.scale.ordinal<string>().domain(['ABCat 1', 'ABCat 2', 'ABCat 3']).range(['#d3d3d3', '#0000ff','#ff0000']);
  private cMut = d3.scale.ordinal<string>().domain(['ABCat 1', 'ABCat 2', 'ABCat 3']).range(['#008000', '#9f8170','#000000']);
  private cBor = d3.scale.ordinal<string>().domain(['ABCat 2', 'ABCat 3']).range(['#ff0000','#0000ff']);
  private yAxis = d3.svg.axis().orient('left').scale(this.y);

  private cellHeight = 25;
  private cellWidth = 7;
  private cellPadding = 3;
  private cellMutation = 5;

  private paramForm:FormBuilder;
  private paramDesc:IFormSelectDesc[] = [
    {
      type: FormElementType.SELECT,
      label: 'Tumor Type',
      id: ParameterFormIds.TUMOR_TYPE,
      options: {
        optionsData: sample_tumor_type,
      },
      useSession: true
    }
  ];

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
      return {id: id, rows: []};
    });

    const $ids = this.$node.selectAll('div.ids').data<IDataFormat>(<any>data, (d) => d.id.toString());
    const $ids_enter = $ids.enter().append('div').classed('ids', true);

    // decide whether to load data for newly added items
    // or to reload the data for all items (e.g. due to parameter change)
    const enterOrUpdateAll = (updateAll) ? $ids : $ids_enter;

    enterOrUpdateAll.each(function(d) {
      const $id = d3.select(this);

      return that.resolveId(idtype,  d.id, 'IDTypeA')
        .then((name) => {
          return ajax.getAPIJSON('/targid/db/dummy/onco_print', {
            a_ids: name,
            b_cat2 : that.getParameter(ParameterFormIds.TUMOR_TYPE)
          });
        })
        .then((rows) => {
          d.rows = rows;

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

    const margin = {top: 10, right: 30, bottom: 10, left: 50},
      width = 960 - margin.left - margin.right,
      height = 60 - margin.top - margin.bottom;

    var svg = $parent.append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    this.x.rangeRoundBands([0, width]);
    this.y.rangeRoundBands([height, 0]);

    svg.append('g')
      .attr('class', 'y axis');
  }


  private updateChartData($parent) {

    const data:IDataFormat = $parent.datum();
    const rows = data.rows;

    this.x.domain(rows.map((d) => d.b_name));
    this.y.domain(rows.map((d) => d.a_name));

    const data2 = d3.nest().key((d:any) => d.a_name).entries(rows);

    const svg = $parent.select('svg g');

    svg.select('g.y.axis').call(this.yAxis);

    // data binding
    const marks = svg.selectAll('.row').data(data2);

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
}

interface IDataFormat {
  id: number;
  rows: {a_name: string, b_name: string, ab_cat: string}[];
}

export function create(context:IViewContext, selection:ISelection, parent:Element, options?) {
  return new OncoPrint(context, selection, parent, options);
}


