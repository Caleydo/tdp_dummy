/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
export var categories: string[];
export var types: string[];
export var samples: string[];
export namespace dataSourceA {
    export const name: string;
    export const idType: string;
    export const table: string;
}
export namespace dataSourceB {
    const name_1: string;
    export { name_1 as name };
    const idType_1: string;
    export { idType_1 as idType };
    const table_1: string;
    export { table_1 as table };
}
export function ParameterFormIds(): void;
export namespace ParameterFormIds {
    export const SAMPLE: string;
    export const TYPE: string;
    export const SCORE_ATTRIBUTE: string;
    export const SCORE_AGGREGATION: string;
}
