/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import {types, samples, ParameterFormIds, dataSourceB} from '../base/config';
import {FormElementType} from 'tdp_core';
import {ARankingView, AdapterUtils, ColumnDescUtils} from 'tdp_core';
import {RestBaseUtils} from 'tdp_core';
import {IDTypeManager} from 'phovea_core';

export class DummyDependentList extends ARankingView {

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
    return IDTypeManager.getInstance().resolveIdType(dataSourceB.idType);
  }

  protected loadColumnDesc() {
    return RestBaseUtils.getTDPDesc('dummy', 'b');
  }

  protected loadRows() {
    return RestBaseUtils.getTDPRows('dummy', 'b');
  }

  protected createSelectionAdapter() {
    return AdapterUtils.single({
      loadData: (_id: number, id: string) => this.loadSelectionColumnData(id),
      createDesc: (_id: number, id: string) => DummyDependentList.getSelectionColumnDesc(_id, id)
    });
  }

  private static getSelectionColumnDesc(_id: number, label: string) {
    const s: any = ColumnDescUtils.numberCol(`col_${_id}`, 0, 1, {label});
    s.constantDomain = true;
    return s;
  }

  private loadSelectionColumnData(name: string) {
    const param = {
      attribute: 'ab_real',
      name
    };
    const filters = {
      ab_cat: this.getParameterData(ParameterFormIds.TYPE),
      b_cat2: this.getParameterData(ParameterFormIds.SAMPLE),
    };
    return RestBaseUtils.getTDPScore<number>('dummy', 'b_single_score', param, filters);
  }
}
