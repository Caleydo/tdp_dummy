/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
/// <reference path='../../tsd.d.ts' />

import ajax = require('../caleydo_core/ajax');
import {IScore} from '../targid2/LineUpView';
import idtypes = require('../caleydo_core/idtype');
import ranges = require('../caleydo_core/range');

class AvgScore implements IScore<number> {
  createDesc() {
    return {
      type: 'number',
      label: 'AvgScore',
      domain: [0, 100]
    };
  }
  compute(ids: ranges.Range, idtype: idtypes.IDType): Promise<{ [id:string]: number }> {
    return ajax.getAPIJSON('/targid/db/dummy/avg_score').then((rows: any[]) => {
      const r : { [id:string]: number } = {};
      rows.forEach((row) => {
        r[row._id] = row.score;
      });
      return r;
    });
  }
}

export function create() {
  return new AvgScore();
}


