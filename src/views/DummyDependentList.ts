/**
 * Created by Samuel Gratzl on 29.01.2016.
 */


import * as ajax from 'phovea_core/src/ajax';
import * as idtypes from 'phovea_core/src/idtype';
import {IViewContext, ISelection} from 'ordino/src/View';
import {ALineUpView2, stringCol, numberCol2, useDefaultLayout} from 'ordino/src/LineUpView';
import {types, samples, ParameterFormIds} from '../Configs';
import {FormBuilder, FormElementType, IFormSelectDesc} from 'ordino/src/FormBuilder';
import {showErrorModalDialog} from 'ordino/src/Dialogs';
import {IScoreRow} from 'ordino/src/lineup/IScore';

class DummyDependentList extends ALineUpView2 {

  private paramForm:FormBuilder;
  private paramDesc:IFormSelectDesc[] = [
    {
      type: FormElementType.SELECT,
      label: 'Type',
      id: ParameterFormIds.TYPE,
      options: {
        optionsData: types
      },
      useSession: true
    },
    {
      type: FormElementType.SELECT,
      label: 'Sample Type',
      id: ParameterFormIds.SAMPLE,
      options: {
        optionsData: samples
      },
      useSession: true
    }
  ];

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
    this.clear();
    return this.update();
  }

  protected loadColumnDesc() {
    return Promise.resolve({
      idType: 'IDTypeB',
      columns: []
    });
  }

  protected initColumns(desc) {
    super.initColumns(desc);

    const columns = [
      stringCol('a_name','Name'),
    ];

    this.build([], columns);
    this.handleSelectionColumns(this.selection);
    return columns;
  }

  protected loadRows() {
    const url = `/targid/db/bien/b/filter`;
    const param = {
      _assignids: true
    };
    return ajax.getAPIJSON(url, param);
  }


  protected async getSelectionColumnDesc(id: number) {
    const label = await this.getSelectionColumnLabel(id);

    return numberCol2(this.getSelectionColumnId(id), 0, 100, label, true, 50, id);
  }

  protected getSelectionColumnLabel(id: number) {
    return this.resolveId(this.selection.idtype, id, this.idType);
  }

  protected async loadSelectionColumnData(id: number): Promise<IScoreRow<any>[]> {
    const url = `/targid/db/dummy/a_single_score/filter`;
    const param = {
      filter_ab_cat: this.getParameter(ParameterFormIds.TYPE),
      filter_b_cat2: this.getParameter(ParameterFormIds.SAMPLE),
      id
    };
    return ajax.getAPIJSON(url, param);
  }

}
export function create(context:IViewContext, selection: ISelection, parent:Element, options?) {
  return new DummyDependentList(context, selection, parent, options);
}


