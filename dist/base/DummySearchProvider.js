import { dataSourceA, dataSourceB } from '../config';
import { getTDPLookup, getTDPFilteredRows } from 'tdp_core/src/rest';
import '../scss/style.scss';
export class DummySearchProvider {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    search(query, page, pageSize) {
        return getTDPLookup('dummy', `${this.dataSource.table}_items`, {
            column: `${this.dataSource.table}_name`,
            query,
            page,
            limit: pageSize
        });
    }
    validate(query) {
        return getTDPFilteredRows('dummy', `${this.dataSource.table}_items_verify`, {}, {
            [`${this.dataSource.table}_name`]: query
        });
    }
}
export function createA() {
    return new DummySearchProvider(dataSourceA);
}
export function createB() {
    return new DummySearchProvider(dataSourceB);
}
//# sourceMappingURL=DummySearchProvider.js.map