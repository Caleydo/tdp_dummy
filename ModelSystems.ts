/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
/// <reference path="../../tsd.d.ts" />

import ajax = require('../caleydo_core/ajax');
import idtypes = require('../caleydo_core/idtype');
import {IViewContext, ISelection} from '../targid2/View';
import {ALineUpView, stringCol, numberCol2, useDefaultLayout} from '../targid2/LineUpView';
import {alteration_types} from './Configs';
import {FormBuilder, FormElement, IFormSelectDesc} from '../targid2/FormBuilder';
import {ParameterFormIds} from '../targid_celllinedb/Common';

class ModelSystems extends ALineUpView {

  private lineupPromise : Promise<any>;

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

  private update() {
    const id = this.selection.range.first;
    const idtype = this.selection.idtype;
    this.setBusy(true);
    return Promise.all([this.lineupPromise, this.resolveId(idtype, id, 'IDTypeA')]).then((args) => {
      const gene_name = args[1];
      return ajax.getAPIJSON('/targid/db/dummy/model_systems', {
        a_id: gene_name,
        ab_cat: this.getParameter(ParameterFormIds.ALTERATION_TYPE)
      });
    }).then((rows) => {
      this.replaceLineUpData(rows);
      this.setBusy(false);
    });
  }

  private build() {
    //generate random data
    this.setBusy(true);
    const columns = [
      stringCol('b_name','Name'),
      numberCol2('ab_real', -1, 1),
    ];
    var lineup = this.buildLineUp([], columns, idtypes.resolve('IDTypeB'),(d) => d._id);
    useDefaultLayout(lineup);
    this.setBusy(false);

    this.lineupPromise = Promise.resolve(lineup);
  }
}
export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new ModelSystems(context, selection, parent, options);
}


