import {getTDPDesc, getTDPRows, IRow, IServerColumn} from 'tdp_core/src/rest';
import {ISelection, IViewContext} from 'tdp_core/src/views/index';
import ARankingView, {IRankingWrapper, DataProvider} from 'tdp_core/src/lineup/ARankingView';
import {linkCol, stringCol} from 'tdp_core/src/lineup';
import CategoricalColumn from 'lineupjs/src/model/CategoricalColumn';
import NumberColumn from 'lineupjs/src/model/NumberColumn';

export default class TestRankingView extends ARankingView {
  constructor(context: IViewContext, selection: ISelection, parent: HTMLElement, options = {}) {
    super(context, selection, parent, Object.assign({
      enableAddingColumns: false, // disable adding columns
      enableOverviewMode: false, //'active', // active overview mode by default, disable with "false" for custom heights
      enableStripedBackground: true, // alternating background pattern
      itemRowHeight: (row, index) => this.heightOf(index),

      enableHeaderRotation: true, // rotate labels if to narrow
      customOptions: {
        header: {
          rotationHeight: 200,
          rotationDegree: -45
        }
      }
    }, options));
  }


  private heightOf(index: number) {
    return 8 + Math.min(index, 60);
  }

  protected loadColumnDesc() {
    return getTDPDesc('dummy', 'b');
  }

  protected getColumnDescs(loaded: IServerColumn[]) {
    const base = super.getColumnDescs(loaded);

    // push a link column
    base.push(linkCol('b_name', 'https://duckduckgo.com/?q=$2', {label: 'B Link'}));
    // push a link column rendered as an image
    base.push(linkCol('b_name', 'https://picsum.photos/80/80/?random', {
      label: 'B Very Long Image Link Such That It Cannot Fit',
      extras: {rendererType: 'image'}
    }));

    // push a column with a custom accessor to render HTML
    base.push(Object.assign(stringCol('b_name'), {
      label: 'B HTML',
      accessor: (row: IRow) => `<strong>${row.b_name}</strong><i class="fa fa-flash"></i>`,
      escape: false
    }));

    // push a column with a custom accessor to render HTML
    base.push(Object.assign(stringCol('b_name'), {
      label: 'B Table',
      accessor: (row: IRow) => `<table style="width: 100%">
        <tr><th style="width: 5em">Key</th><td>${row.b_name}</td></tr>
        <tr><th>Bla</th><td>${row.b_name}22</td></tr>
        </table>`,
      escape: false
    }));

    return base;
  }

  protected loadRows() {
    return getTDPRows('dummy', 'b');
  }

  protected createInitialRanking(lineup: DataProvider) {
    super.createInitialRanking(lineup, {
      rank: false, // disable rank column
      aggregate: false, // disable group collapse column
      selection: false, // disable selection column,
      order: ['B Name', 'B Cat1', 'B Cat2', 'B Int', 'B Real', 'B Link', 'B Very Long Image Link Such That It Cannot Fit', 'B HTML', 'B Table'] // fix column order
    });
  }

  protected customizeRanking(ranking: IRankingWrapper) {
    ranking.groupBy('B Cat1');
    ranking.sortBy('B Int', false);

    const ccol = <CategoricalColumn>ranking.findColumn('B Cat1');
    ccol.setFilter({
      filter: ['BCat 1', 'BCat 2'], // list all categories that should be included
      filterMissing: true
    });

    const ncol = <NumberColumn>ranking.findColumn('B Int');
    ncol.setFilter({
      min: 50,
      max: 100,
      filterMissing: true
    });
  }
}
