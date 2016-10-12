/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

import ajax = require('../caleydo_core/ajax');
import {IScore} from '../targid2/LineUpView';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');
import dialogs = require('../caleydo_bootstrap_fontawesome/dialogs');

class AvgScore implements IScore<number> {
  constructor(private name = 'AvgScore') {

  }
  createDesc() {
    return {
      type: 'number',
      label: this.name,
      domain: [0, 100]
    };
  }
  compute(ids: ranges.Range, idtype: idtypes.IDType): Promise<any[]> {
    return ajax.getAPIJSON('/targid/db/dummy/avg_score');
  }
}

export function create() {
  return new AvgScore();
}

export function createParameterized() {
  return dialogs.prompt('New Avg Score').then((name) => new AvgScore(name));
}


