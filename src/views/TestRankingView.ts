import {getTDPDesc, getTDPRows} from 'tdp_core/src/rest';
import {ISelection, IViewContext} from 'tdp_core/src/views/index';
import ARankingView from 'tdp_core/src/lineup/ARankingView';

export default class TestRankingView extends ARankingView {
  constructor(context: IViewContext, selection: ISelection, parent: HTMLElement, options = {}) {
    super(context, selection, parent, Object.assign({

    }, options));
  }

  protected loadColumnDesc() {
    return getTDPDesc('dummy', 'b');
  }

  protected loadRows() {
   return getTDPRows('dummy', 'b');
  }
}
