/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import { types, dataSourceA, ParameterFormIds } from '../base/config';
import { FormElementType } from 'tdp_core';
import { AdapterUtils, ARankingView, ColumnDescUtils } from 'tdp_core';
import { RestBaseUtils } from 'tdp_core';
import { IDTypeManager } from 'phovea_core';
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
        return IDTypeManager.getInstance().resolveIdType(dataSourceA.idType);
    }
    loadColumnDesc() {
        return RestBaseUtils.getTDPDesc('dummy', 'a');
    }
    loadRows() {
        return RestBaseUtils.getTDPRows('dummy', 'a');
    }
    createSelectionAdapter() {
        return AdapterUtils.single({
            loadData: (_id, id) => this.loadSelectionColumnData(id),
            createDesc: (_id, id) => DummyDependentBList.getSelectionColumnDesc(_id, id)
        });
    }
    static getSelectionColumnDesc(_id, label) {
        const s = ColumnDescUtils.numberCol(`col_${_id}`, 0, 1, { label });
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
        return RestBaseUtils.getTDPScore('dummy', 'a_single_score', param, filters);
    }
}
//# sourceMappingURL=DummyDependentBList.js.map