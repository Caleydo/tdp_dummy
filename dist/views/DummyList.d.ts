/**
 * Created by Samuel Gratzl on 29.01.2016.
 */
import { IViewContext, ISelection } from 'tdp_core';
import { IDummyDataSource } from '../base/config';
import { AStartList } from 'tdp_core';
export declare class DummyStartList extends AStartList {
    private readonly dataSource;
    constructor(context: IViewContext, dataSource: IDummyDataSource, selection: ISelection, parent: HTMLElement, options?: {});
    protected loadColumnDesc(): Promise<Readonly<import("tdp_core").IDatabaseViewDesc>>;
    protected loadRows(): Promise<import("tdp_core").IRow[]>;
    static createStartA(context: IViewContext, selection: ISelection, parent: HTMLElement, options?: any): DummyStartList;
    static createStartB(context: IViewContext, selection: ISelection, parent: HTMLElement, options?: any): DummyStartList;
}
