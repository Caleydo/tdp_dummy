/**
 * Created by Samuel Gratzl on 27.04.2016.
 */

import {IScore, IScoreParam} from 'tdp_core';
import {samples, ParameterFormIds, IDummyDataSource, dataSourceA, dataSourceB} from '../base/config';
import {IDTypeManager} from 'phovea_core';
import {FormDialog, IFormElementDesc, FormElementType} from 'tdp_core';
import {RestBaseUtils} from 'tdp_core';

class DummyScore implements IScore<number> {
  private readonly dataSource: IDummyDataSource;

  constructor(table: 'a' | 'b', private readonly score: string, private readonly tumorSample: string, private readonly aggregation: string) {
    this.dataSource = table === 'a' ? dataSourceA : dataSourceB;
  }

  get idType() {
    return IDTypeManager.getInstance().resolveIdType(this.dataSource.idType);
  }

  createDesc() {
    return {
      type: 'number',
      label: `${this.aggregation} ${this.score} @ ${this.tumorSample}`,
      domain: this.score === 'ab_int' ? [0, 100] : [-1, 1]
    };
  }

  compute(): Promise<any[]> {
    return RestBaseUtils.getTDPScore('dummy', `${this.dataSource.table}_score`, {
      data_subtype: this.score,
      agg: this.aggregation,
      filter_b_cat2: this.tumorSample
    });
  }

  static createScore(params: { table: 'a' | 'b', score: string, tumorSample: string, aggregation: string }) {
    return new DummyScore(params.table, params.score, params.tumorSample, params.aggregation);
  }

  static create(desc: any): Promise<IScoreParam> {
    const table = desc.idType === dataSourceA.idType ? 'a' : 'b';

    const dialog = new FormDialog('Add Score Column', 'Add Score Column');
    const formDesc: IFormElementDesc[] = [
      {
        type: FormElementType.SELECT,
        label: 'Sample',
        id: ParameterFormIds.SAMPLE,
        options: {
          optionsData: samples
        },
        useSession: true
      },
      {
        type: FormElementType.SELECT,
        label: 'Score',
        id: ParameterFormIds.SCORE_ATTRIBUTE,
        options: {
          optionsData: [
            {value: 'ab_real', name: 'Real', data: 'ab_real'},
            {value: 'ab_int', name: 'Int', data: 'ab_int'}
          ]
        },
        useSession: true
      },
      {
        type: FormElementType.SELECT,
        label: 'Aggregation',
        id: ParameterFormIds.SCORE_AGGREGATION,
        options: {
          optionsData: [
            {value: 'avg', name: 'AVG', data: 'avg'},
            {value: 'min', name: 'MIN', data: 'min'},
            {value: 'max', name: 'MAX', data: 'max'}
          ]
        },
        useSession: true
      }
    ];
    dialog.append(...formDesc);

    return dialog.showAsPromise((builder) => {
      const data = builder.getElementData();
      return {
        table,
        score: data[ParameterFormIds.SCORE_ATTRIBUTE],
        tumorSample: data[ParameterFormIds.SAMPLE],
        aggregation: data[ParameterFormIds.SCORE_AGGREGATION]
      };
    });
  }
}





