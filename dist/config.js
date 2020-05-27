/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
export var categories = ['ACat 1', 'ACat 2', 'ACat 3'];
export var types = ['ABCat 1', 'ABCat 2', 'ABCat 3'];
export var samples = ['BCatB 1', 'BCatB 2', 'BCatB 3', 'BCatB 4', 'BCatB 5'];
/**
 * List of ids for parameter form elements
 * Reuse this ids and activate the `useSession` option for form elements to have the same selectedIndex between different views
 */
//TODO simplify by using unique prefix to avoid collisions
var ParameterFormIds = /** @class */ (function () {
    function ParameterFormIds() {
    }
    ParameterFormIds.SAMPLE = 'dummySample';
    ParameterFormIds.TYPE = 'dummyType';
    ParameterFormIds.SCORE_ATTRIBUTE = 'dummyAttr';
    ParameterFormIds.SCORE_AGGREGATION = 'dummyAggregation';
    return ParameterFormIds;
}());
export { ParameterFormIds };
export var dataSourceA = {
    name: 'a',
    idType: 'IDTypeA',
    table: 'a'
};
export var dataSourceB = {
    name: 'b',
    idType: 'IDTypeB',
    table: 'b'
};
//# sourceMappingURL=config.js.map
//# sourceMappingURL=config.js.map