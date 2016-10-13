/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

import ajax = require('../caleydo_core/ajax');
import {IScore} from '../targid2/LineUpView';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');
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
        id: 'dummySample',
        options: {
          optionsData: [
            { value:"BCatB 1", name:"BCatB 1", data:"BCatB 1" },
            { value:"BCatB 2", name:"BCatB 2", data:"BCatB 2" },
            { value:"BCatB 3", name:"BCatB 3", data:"BCatB 3" },
            { value:"BCatB 4", name:"BCatB 4", data:"BCatB 4" },
            { value:"BCatB 5", name:"BCatB 5", data:"BCatB 5" }
          ]
        },
        useSession: true
      },
      {
        type: FormElementType.SELECT,
        label: 'Score',
        id: 'dummyScore',
        options: {
          optionsData: [
            { value:"ab_real", name:"Real", data:"ab_real" },
            { value:"ab_int", name:"Int", data:"ab_int" }
          ]
        },
        useSession: true
      },
      {
        type: FormElementType.SELECT,
        label: 'Aggregation',
        id: 'dummyAggregation',
        options: {
          optionsData: [
            { value:"avg", name:"AVG", data:"avg" },
            { value:"min", name:"MIN", data:"min" },
            { value:"max", name:"MAX", data:"max" }
          ]
        },
        useSession: true
      }
    ];

    form.build(formDesc);

    dialog.onSubmit(() => {
      const data = form.getElementData();

      const score = new DummyScore(data.dummyScore, data.dummySample, data.dummyAggregation);

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



