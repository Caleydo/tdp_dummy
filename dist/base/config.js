/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
export const categories = ['ACat 1', 'ACat 2', 'ACat 3'];
export const types = ['ABCat 1', 'ABCat 2', 'ABCat 3'];
export const samples = ['BCatB 1', 'BCatB 2', 'BCatB 3', 'BCatB 4', 'BCatB 5'];
/**
 * List of ids for parameter form elements
 * Reuse this ids and activate the `useSession` option for form elements to have the same selectedIndex between different views
 */
//TODO simplify by using unique prefix to avoid collisions
export class ParameterFormIds {
}
ParameterFormIds.SAMPLE = 'dummySample';
ParameterFormIds.TYPE = 'dummyType';
ParameterFormIds.SCORE_ATTRIBUTE = 'dummyAttr';
ParameterFormIds.SCORE_AGGREGATION = 'dummyAggregation';
export const dataSourceA = {
    name: 'a',
    idType: 'IDTypeA',
    table: 'a'
};
export const dataSourceB = {
    name: 'b',
    idType: 'IDTypeB',
    table: 'b'
};
//# sourceMappingURL=config.js.map