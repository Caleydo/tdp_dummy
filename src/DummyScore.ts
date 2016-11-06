/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

import * as ajax from 'phovea_core/src/ajax';
import {IScore} from '../targid2/LineUpView';
import * as idtypes from 'phovea_core/src/idtype';
import * as ranges from 'phovea_core/src/range';
import * as dialogs from 'phovea_bootstrap_fontawesome/src/dialogs';
import {samples, ParameterFormIds} from './Configs';
import {FormBuilder, IFormElementDesc, FormElementType} from '../targid2/FormBuilder';

class DummyScore implements IScore<number> {
  constructor(private score: string, private tumor_sample: string, private aggregation) {

  }

  createDesc() {
    return {
      type: 'number',
      label: `${this.aggregation} ${this.score} @ ${this.tumor_sample}`,
      domain: this.score === 'ab_int' ? [0, 100] : [-1, 1]
    };
  }
  compute(ids: ranges.Range, idtype: idtypes.IDType): Promise<any[]> {
    return ajax.getAPIJSON('/targid/db/dummy/score', {
      _assignids : true, //assign globally ids on the server side
      score: this.score,
      b_cat2 : this.tumor_sample,
      agg: this.aggregation
    });
  }
}

export function create() {
   return new Promise((resolve) => {
     const dialog = dialogs.generateDialog('Add Score Column', 'Add Score Column');

    const form:FormBuilder = new FormBuilder(d3.select(dialog.body));
    const formDesc:IFormElementDesc[] = [
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
            { value:'ab_real', name:'Real', data:'ab_real' },
            { value:'ab_int', name:'Int', data:'ab_int' }
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
            { value:'avg', name:'AVG', data:'avg' },
            { value:'min', name:'MIN', data:'min' },
            { value:'max', name:'MAX', data:'max' }
          ]
        },
        useSession: true
      }
    ];

    form.build(formDesc);

    dialog.onSubmit(() => {
      const data = form.getElementData();

      const score = new DummyScore(data[ParameterFormIds.SCORE_ATTRIBUTE], data[ParameterFormIds.SAMPLE], data[ParameterFormIds.SCORE_AGGREGATION]);

      dialog.hide();
      resolve(score);
      return false;
    });

    dialog.onHide(() => {
      dialog.destroy();
    });

    dialog.show();
  });
}



