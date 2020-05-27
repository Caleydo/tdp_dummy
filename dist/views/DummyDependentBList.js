/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import { types, dataSourceA, ParameterFormIds } from '../base/config';
import { FormElementType } from 'tdp_core';
import { single, ARankingView, numberCol } from 'tdp_core';
import { getTDPDesc, getTDPRows, getTDPScore } from 'tdp_core';
import { resolve } from 'phovea_core';
export class DummyDependentBList extends ARankingView {
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
            }
        ]);
    }
    get itemIDType() {
        return resolve(dataSourceA.idType);
    }
    loadColumnDesc() {
        return getTDPDesc('dummy', 'a');
    }
    loadRows() {
        return getTDPRows('dummy', 'a');
    }
    createSelectionAdapter() {
        return single({
            loadData: (_id, id) => this.loadSelectionColumnData(id),
            createDesc: (_id, id) => DummyDependentBList.getSelectionColumnDesc(_id, id)
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
            ab_cat: this.getParameterData(ParameterFormIds.TYPE)
        };
        return getTDPScore('dummy', 'a_single_score', param, filters);
    }
}
//# sourceMappingURL=DummyDependentBList.js.map