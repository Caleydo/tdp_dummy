import ATableView from 'tdp_core/src/views/ATableView';
import AView from 'tdp_core/src/views/AView';
import {VIEW_COMPOSITE_EVENT_CHANGE_RATIOS} from 'tdp_core/src/views/CompositeView';


export class DummyA extends AView {
  initImpl() {
    super.initImpl();
    this.node.innerHTML = 'A';
    let i = 0;
    this.node.onclick = () => {
      this.updateShared('SHARED', (i++));
      if (i === 2) {
        this.fire(VIEW_COMPOSITE_EVENT_CHANGE_RATIOS, 0.2, 0.8);
      }
    };
  }
}

export class DummyB extends ATableView<any> {
  protected loadRows() {
    const v = this.getShared('SHARED') || 1;
    const r = <any[]>[];
    for (let i = 0; i < v; ++i) {
      r.push({id: 'a', _id: -1, v: String(v)});
    }
    return r;
  }

  protected sharedChanged(name: string) {
    if (name === 'SHARED') {
      this.reloadData();
    }
  }
}

export class DummyC extends AView {
  initImpl() {
    super.initImpl();
    this.node.innerHTML = 'CCC';
    let i = 0;
    this.node.onclick = () => {
      this.updateShared('SHARED2', (i++));
      if (i === 2) {
        this.fire(VIEW_COMPOSITE_EVENT_CHANGE_RATIOS, 0.2, 0.8);
      }
    };
  }
}

