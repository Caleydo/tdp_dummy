import { dataSourceA, dataSourceB } from './config';
import { RestBaseUtils } from 'tdp_core';
import '../scss/main.scss';
export class DummySearchProvider {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    search(query, page, pageSize) {
        return RestBaseUtils.getTDPLookup('dummy', `${this.dataSource.table}_items`, {
            column: `${this.dataSource.table}_name`,
            query,
            page,
            limit: pageSize
        });
    }
    validate(query) {
        return RestBaseUtils.getTDPFilteredRows('dummy', `${this.dataSource.table}_items_verify`, {}, {
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