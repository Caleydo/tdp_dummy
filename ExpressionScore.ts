/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

import ajax = require('../caleydo_core/ajax');
import {IScore} from '../targid2/LineUpView';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');

class ExpressionScore implements IScore<number> {
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
    return ajax.getAPIJSON('/targid/db/dummy/expression_score', {
      score: this.score,
      b_cat2 : this.tumor_sample,
      agg: this.aggregation
    });
  }
}

export function create() {
   return new Promise((resolve) => {
     const dialog = dialogs.generateDialog('Add Score');
     dialog.body.innerHTML = `<form><div class="form-group">
        <label for="tumorSample">Tumor Sample</label>
        <select class="form-control" id="tumorSample">
           <option value="BCatB 1" selected="selected">BCatB 1</option><option value="BCatB 2">BCatB 2</option><option value="BCatB 3">BCatB 3</option><option value="BCatB 4">BCatB 4</option><option value="BCatB 5">BCatB 5</option>  
        </select>
      </div>
      <div class="form-group">
        <label for="score">Score</label>
        <select class="form-control" id="score">
           <option value="ab_real" selected="selected">Real</option><option value="ab_int">Int</option>  
        </select>
      </div>
      <div class="form-group">
        <label for="agg">Aggregation</label>
        <select class="form-control" id="agg">
           <option value="avg" selected="selected">AVG</option><option value="min">MIN</option><option value="max">MAX</option>  
        </select>
      </div></form>`;
     (<HTMLFormElement>dialog.body.querySelector('form')).onsubmit = () => {
       const tumorSample = (<HTMLSelectElement>dialog.body.querySelector('#tumorSample')).value;
       const score = (<HTMLSelectElement>dialog.body.querySelector('#score')).value;
       const agg = (<HTMLSelectElement>dialog.body.querySelector('#agg')).value;
       const s = new ExpressionScore(score, tumorSample, agg);
       dialog.hide();
       resolve(s);
       return false;
     };
     dialog.onHide(() => {
       dialog.destroy();
     });
     dialog.show();
   });
}



