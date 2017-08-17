/**
 * Created by Samuel Gratzl on 29.01.2016.
 */


import {getAPIJSON} from 'phovea_core/src/ajax';
import {IViewContext, ISelection} from 'ordino/src/View';
import {ALineUpView2, numberCol2} from 'ordino/src/LineUpView';
import {types, samples, ParameterFormIds, dataSourceB} from '../config';
import {FormBuilder, FormElementType, IFormSelectDesc} from 'ordino/src/FormBuilder';
import {IScoreRow} from 'ordino/src/lineup/IScore';

export default class DummyDependentList extends ALineUpView2 {

  private paramForm: FormBuilder;
  private paramDesc: IFormSelectDesc[] = [
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

  buildParameterUI($parent: d3.Selection<any>, onChange: (name: string, value: any) => Promise<any>) {
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
    return getAPIJSON(`/targid/db/dummy/${dataSourceB.table}/desc`);
  }

  protected initColumns(desc) {
    super.initColumns(desc);

    const columns = dataSourceB.columns(desc);

    this.build([], columns);
    this.handleSelectionColumns(this.selection);
    return columns;
  }

  protected loadRows() {
    const param = {
      _assignids: true
    };
    return getAPIJSON(`/targid/db/dummy/${dataSourceB.table}/filter`, param);
  }


  protected async getSelectionColumnDesc(id: number) {
    const label = await this.getSelectionColumnLabel(id);

    const s: any = numberCol2(this.getSelectionColumnId(id), -1, 1, label, true, 50, id);
    s.constantDomain = true;
    return s;
  }

  protected getSelectionColumnLabel(id: number) {
    return this.resolveId(this.selection.idtype, id, this.idType);
  }

  protected async loadSelectionColumnData(id: number): Promise<IScoreRow<any>[]> {
    const url = `/targid/db/dummy/b_single_score/score`;
    const name = await this.resolveId(this.selection.idtype, id);
    const param = {
      attribute: 'ab_real',
      filter_ab_cat: this.getParameter(ParameterFormIds.TYPE),
      filter_b_cat2: this.getParameter(ParameterFormIds.SAMPLE),
      name
    };
    return getAPIJSON(url, param);
  }

}

