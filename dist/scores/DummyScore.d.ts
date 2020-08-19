/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
import { IScore, IScoreParam } from 'tdp_core';
export declare class DummyScore implements IScore<number> {
    private readonly score;
    private readonly tumorSample;
    private readonly aggregation;
    private readonly dataSource;
    constructor(table: 'a' | 'b', score: string, tumorSample: string, aggregation: string);
    get idType(): import("phovea_core").IDType;
    createDesc(): {
        type: string;
        label: string;
        domain: number[];
    };
    compute(): Promise<any[]>;
    static createScore(params: {
        table: 'a' | 'b';
        score: string;
        tumorSample: string;
        aggregation: string;
    }): DummyScore;
    static create(desc: any): Promise<IScoreParam>;
}
