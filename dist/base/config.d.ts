/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
export declare const categories: string[];
export declare const types: string[];
export declare const samples: string[];
/**
 * List of ids for parameter form elements
 * Reuse this ids and activate the `useSession` option for form elements to have the same selectedIndex between different views
 */
export declare class ParameterFormIds {
    static SAMPLE: string;
    static TYPE: string;
    static SCORE_ATTRIBUTE: string;
    static SCORE_AGGREGATION: string;
}
export interface IDummyDataSource {
    name: string;
    idType: string;
    table: string;
}
export declare const dataSourceA: IDummyDataSource;
export declare const dataSourceB: IDummyDataSource;
