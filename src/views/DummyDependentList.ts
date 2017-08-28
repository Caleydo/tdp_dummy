/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {types, samples, ParameterFormIds, dataSourceB} from '../config';
import {FormElementType} from 'tdp_core/src/form';
import {single, ARankingView, numberCol} from 'tdp_core/src/lineup';
import {getTDPDesc, getTDPRows, getTDPScore} from 'tdp_core/src/rest';
import {resolve} from 'phovea_core/src/idtype';

export default class DummyDependentList extends ARankingView {

  protected getParameterFormDescs() {
    return super.getParameterFormDescs().concat([
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
    ]);
  }

  get itemIDType() {
    return resolve(dataSourceB.idType);
  }

  protected loadColumnDesc() {
    return getTDPDesc('dummy', 'b');
  }

  protected loadRows() {
    return getTDPRows('dummy', 'b');
  }

  protected createSelectionAdapter() {
    return single({
      loadData: (_id: number, id: string) => this.loadSelectionColumnData(id),
      createDesc: (_id: number, id: string) => DummyDependentList.getSelectionColumnDesc(_id, id)
    });
  }

  private static getSelectionColumnDesc(_id: number, label: string) {
    const s: any = numberCol(`col_${_id}`, 0, 1, {label});
    s.constantDomain = true;
    return s;
  }

  private loadSelectionColumnData(name: string) {
    const param = {
      attribute: 'ab_real',
      name
    };
    const filters = {
      ab_cat: this.getParameter(ParameterFormIds.TYPE),
      b_cat2: this.getParameter(ParameterFormIds.SAMPLE),
    };
    return getTDPScore<number>('dummy', 'b_single_score', param, filters);
  }
}
