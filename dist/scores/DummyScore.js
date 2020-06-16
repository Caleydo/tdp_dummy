/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
import { samples, ParameterFormIds, dataSourceA, dataSourceB } from '../base/config';
import { IDTypeManager } from 'phovea_core';
import { FormDialog, FormElementType } from 'tdp_core';
import { RestBaseUtils } from 'tdp_core';
export class DummyScore {
    constructor(table, score, tumorSample, aggregation) {
        this.score = score;
        this.tumorSample = tumorSample;
        this.aggregation = aggregation;
        this.dataSource = table === 'a' ? dataSourceA : dataSourceB;
    }
    get idType() {
        return IDTypeManager.getInstance().resolveIdType(this.dataSource.idType);
    }
    createDesc() {
        return {
            type: 'number',
            label: `${this.aggregation} ${this.score} @ ${this.tumorSample}`,
            domain: this.score === 'ab_int' ? [0, 100] : [-1, 1]
        };
    }
    compute() {
        return RestBaseUtils.getTDPScore('dummy', `${this.dataSource.table}_score`, {
            data_subtype: this.score,
            agg: this.aggregation,
            filter_b_cat2: this.tumorSample
        });
    }
    static createScore(params) {
        return new DummyScore(params.table, params.score, params.tumorSample, params.aggregation);
    }
    static create(desc) {
        const table = desc.idType === dataSourceA.idType ? 'a' : 'b';
        const dialog = new FormDialog('Add Score Column', 'Add Score Column');
        const formDesc = [
            {
                type: FormElementType.SELECT,
                label: 'Sample',
                id: ParameterFormIds.SAMPLE,
                options: {
                    optionsData: samples
                },
                useSession: true
            },
            {
                type: FormElementType.SELECT,
                label: 'Score',
                id: ParameterFormIds.SCORE_ATTRIBUTE,
                options: {
                    optionsData: [
                        { value: 'ab_real', name: 'Real', data: 'ab_real' },
                        { value: 'ab_int', name: 'Int', data: 'ab_int' }
                    ]
                },
                useSession: true
            },
            {
                type: FormElementType.SELECT,
                label: 'Aggregation',
                id: ParameterFormIds.SCORE_AGGREGATION,
                options: {
                    optionsData: [
                        { value: 'avg', name: 'AVG', data: 'avg' },
                        { value: 'min', name: 'MIN', data: 'min' },
                        { value: 'max', name: 'MAX', data: 'max' }
                    ]
                },
                useSession: true
            }
        ];
        dialog.append(...formDesc);
        return dialog.showAsPromise((builder) => {
            const data = builder.getElementData();
            return {
                table,
                score: data[ParameterFormIds.SCORE_ATTRIBUTE],
                tumorSample: data[ParameterFormIds.SAMPLE],
                aggregation: data[ParameterFormIds.SCORE_AGGREGATION]
            };
        });
    }
}
//# sourceMappingURL=DummyScore.js.map