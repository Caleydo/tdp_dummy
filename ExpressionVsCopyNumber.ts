/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

/// <amd-dependency path='css!./style' />
import ajax = require('../caleydo_core/ajax');
import {AView, IViewContext, ISelection} from '../targid2/View';
import {sample_tumor_type, ParameterFormIds} from './Configs';
import {FormBuilder, FormElementType, IFormSelectDesc} from '../targid2/FormBuilder';
import {showErrorModalDialog} from '../targid2/Dialogs';

class ExpressionVsCopyNumber extends AView {

  private x = d3.scale.linear();
  private y = d3.scale.linear();
  private xAxis = d3.svg.axis().orient('bottom').scale(this.x);
  private yAxis = d3.svg.axis().orient('left').scale(this.y);

  private paramForm:FormBuilder;
  private paramDesc:IFormSelectDesc[] = [
    {
      type: FormElementType.SELECT,
      label: 'Tumor Type',
      id: ParameterFormIds.TUMOR_TYPE,
      options: {
        optionsData: sample_tumor_type
      },
      useSession: true
    }
  ];

  constructor(context:IViewContext, private selection: ISelection, parent:Element, options?) {
    super(context, parent, options);
  }

  init() {
    this.build();
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
    return this.update();
  }

  changeSelection(selection: ISelection) {
    this.selection = selection;
    return this.update();
  }

  private build() {

    const margin = {top: 10, right: 30, bottom: 30, left: 30},
      width = 960 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var svg = this.$node.append('svg')
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


  private updateChart(rows: {value1: number, value2: number}[]) {
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

  private update() {
    const idtype = this.selection.idtype;

    this.setBusy(true);

    const promise = this.resolveId(idtype, this.selection.range.first, 'IDTypeA')
      .then((name) => {
        return ajax.getAPIJSON('/targid/db/dummy/expression_vs_copynumber', {
          a_id: name,
          b_cat2 : this.getParameter(ParameterFormIds.TUMOR_TYPE)
        });
      });

    // on success
    promise.then((rows) => {
      this.updateChart(rows);
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
  return new ExpressionVsCopyNumber(context, selection, parent, options);
}


