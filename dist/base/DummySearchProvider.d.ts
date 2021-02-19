import { IDummyDataSource } from './config';
import { IResult, ISearchProvider } from 'tdp_core';
export declare class DummySearchProvider implements ISearchProvider {
    private readonly dataSource;
    constructor(dataSource: IDummyDataSource);
    search(query: string, page: number, pageSize: number): Promise<Readonly<import("tdp_core").ILookupResult>>;
    validate(query: string[]): Promise<IResult[]>;
}
export declare function createA(): DummySearchProvider;
export declare function createB(): DummySearchProvider;
