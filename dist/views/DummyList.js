import { dataSourceA, dataSourceB } from '../base/config';
import { getTDPDesc, getTDPFilteredRows } from 'tdp_core/src/rest';
import { AStartList } from 'tdp_core/src/views/AStartList';
class DummyStartList extends AStartList {
    constructor(context, dataSource, selection, parent, options = {}) {
        super(context, selection, parent, Object.assign({
            itemName: dataSource.name,
            itemIDType: dataSource.idType
        }, options));
        this.dataSource = dataSource;
    }
    loadColumnDesc() {
        return getTDPDesc('dummy', this.dataSource.table);
    }
    loadRows() {
        const filters = this.buildNamedSetFilters('namedset4id');
        return getTDPFilteredRows('dummy', this.dataSource.table, {}, filters);
    }
    static createStartA(context, selection, parent, options) {
        return new DummyStartList(context, dataSourceA, selection, parent, options);
    }
    static createStartB(context, selection, parent, options) {
        return new DummyStartList(context, dataSourceB, selection, parent, options);
    }
}
//# sourceMappingURL=DummyList.js.map