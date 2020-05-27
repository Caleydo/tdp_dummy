/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import { types, samples, ParameterFormIds, dataSourceB } from '../base/config';
import { FormElementType } from 'tdp_core';
import { single, ARankingView, numberCol } from 'tdp_core';
import { getTDPDesc, getTDPRows, getTDPScore } from 'tdp_core';
import { resolve } from 'phovea_core';
export class DummyDependentList extends ARankingView {
    getParameterFormDescs() {
        return super.getParameterFormDescs().concat([
            {
                type: FormElementType.SELECT,
                label: 'Type',
                id: ParameterFormIds.TYPE,
                options: {
                    optionsData: types
                },
                useSession: true
            },
            {
                type: FormElementType.SELECT,
                label: 'Sample Type',
                id: ParameterFormIds.SAMPLE,
                options: {
                    optionsData: samples
                },
                useSession: true
            }
        ]);
    }
    get itemIDType() {
        return resolve(dataSourceB.idType);
    }
    loadColumnDesc() {
        return getTDPDesc('dummy', 'b');
    }
    loadRows() {
        return getTDPRows('dummy', 'b');
    }
    createSelectionAdapter() {
        return single({
            loadData: (_id, id) => this.loadSelectionColumnData(id),
            createDesc: (_id, id) => DummyDependentList.getSelectionColumnDesc(_id, id)
        });
    }
    static getSelectionColumnDesc(_id, label) {
        const s = numberCol(`col_${_id}`, 0, 1, { label });
        s.constantDomain = true;
        return s;
    }
    loadSelectionColumnData(name) {
        const param = {
            attribute: 'ab_real',
            name
        };
        const filters = {
            ab_cat: this.getParameterData(ParameterFormIds.TYPE),
            b_cat2: this.getParameterData(ParameterFormIds.SAMPLE),
        };
        return getTDPScore('dummy', 'b_single_score', param, filters);
    }
}
//# sourceMappingURL=DummyDependentList.js.map