/**
 * Created by Samuel Gratzl on 27.04.2016.
 */

import * as ajax from 'phovea_core/src/ajax';
import {IScore} from 'ordino/src/LineUpView';
import {IScoreParam} from 'ordino/src/lineup/IScore';
import * as idtypes from 'phovea_core/src/idtype';
import * as ranges from 'phovea_core/src/range';
import * as dialogs from 'phovea_ui/src/dialogs';
import {samples, ParameterFormIds} from './Configs';
import {FormBuilder, IFormElementDesc, FormElementType} from 'ordino/src/FormBuilder';
import {select} from 'd3';

class DummyScore implements IScore<number> {
  constructor(private score: string, private tumorSample: string, private aggregation: string) {

  }

  createDesc() {
    return {
      type: 'number',
      label: `${this.aggregation} ${this.score} @ ${this.tumorSample}`,
      domain: this.score === 'ab_int' ? [0, 100] : [-1, 1]
    };
  }
  compute(ids: ranges.Range, idtype: idtypes.IDType): Promise<any[]> {
    return ajax.getAPIJSON('/targid/db/dummy/score', {
      _assignids : true, //assign globally ids on the server side
      score: this.score,
      b_cat2 : this.tumorSample,
      agg: this.aggregation
    });
  }
}

export function createScore(params: {score: string, tumorSample: string, aggregation: string}) {
  return new DummyScore(params.score, params.tumorSample, params.aggregation);
}

export function create(): Promise<IScoreParam> {
   return new Promise((resolve) => {
     const dialog = dialogs.generateDialog('Add Score Column', 'Add Score Column');

    const form:FormBuilder = new FormBuilder(select(dialog.body));
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

      dialog.hide();
      resolve({score: data[ParameterFormIds.SCORE_ATTRIBUTE], tumorSample: data[ParameterFormIds.SAMPLE], aggregation: data[ParameterFormIds.SCORE_AGGREGATION]});
      return false;
    });

    dialog.onHide(() => {
      dialog.destroy();
    });

    dialog.show();
  });
}



