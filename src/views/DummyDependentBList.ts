/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {types, dataSourceA, ParameterFormIds} from '../base/config';
import {FormElementType} from 'tdp_core/src/form';
import {single, ARankingView, numberCol} from 'tdp_core/src/lineup';
import {getTDPDesc, getTDPRows, getTDPScore} from 'tdp_core/src/rest';
import {resolve} from 'phovea_core/src/idtype';

export class DummyDependentBList extends ARankingView {

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
      }
    ]);
  }

  get itemIDType() {
    return resolve(dataSourceA.idType);
  }

  protected loadColumnDesc() {
    return getTDPDesc('dummy', 'a');
  }

  protected loadRows() {
    return getTDPRows('dummy', 'a');
  }

  protected createSelectionAdapter() {
    return single({
      loadData: (_id: number, id: string) => this.loadSelectionColumnData(id),
      createDesc: (_id: number, id: string) => DummyDependentBList.getSelectionColumnDesc(_id, id)
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
      ab_cat: this.getParameterData(ParameterFormIds.TYPE)
    };
    return getTDPScore<number>('dummy', 'a_single_score', param, filters);
  }
}
