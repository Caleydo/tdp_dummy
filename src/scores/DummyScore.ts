/**
 * Created by Samuel Gratzl on 27.04.2016.
 */

import {IScore, IScoreParam} from 'tdp_core/src/lineup';
import {samples, ParameterFormIds} from '../config';
import {resolve} from 'phovea_core/src/idtype';
import {FormDialog, IFormElementDesc, FormElementType} from 'tdp_core/src/form';
import {getTDPScore} from 'tdp_core/src/rest';

class DummyScore implements IScore<number> {
  constructor(private table: 'a' | 'b', private score: string, private tumorSample: string, private aggregation: string) {

  }

  get idType() {
    return resolve(this.table === 'a' ? 'IDTypeA' : 'IDTypeB');
  }

  createDesc() {
    return {
      type: 'number',
      label: `${this.aggregation} ${this.score} @ ${this.tumorSample}`,
      domain: this.score === 'ab_int' ? [0, 100] : [-1, 1]
    };
  }

  compute(): Promise<any[]> {
    return getTDPScore(this.table, `${this.table}_score`, {
      data_subtype: this.score,
      agg: this.aggregation,
      filter_b_cat2: this.tumorSample
    });
  }
}

export function createScore(params: { table: 'a' | 'b', score: string, tumorSample: string, aggregation: string }) {
  return new DummyScore(params.table, params.score, params.tumorSample, params.aggregation);
}

export function create(desc: any): Promise<IScoreParam> {
  const table = desc.idType === 'IDTypeA' ? 'a' : 'b';

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



