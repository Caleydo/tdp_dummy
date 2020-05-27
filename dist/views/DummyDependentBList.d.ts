import { ARankingView } from 'tdp_core';
export declare class DummyDependentBList extends ARankingView {
    protected getParameterFormDescs(): import("tdp_core").IFormElementDesc[];
    get itemIDType(): import("phovea_core").IDType;
    protected loadColumnDesc(): Promise<Readonly<import("tdp_core").IDatabaseViewDesc>>;
    protected loadRows(): Promise<import("tdp_core").IRow[]>;
    protected createSelectionAdapter(): import("tdp_core").ISelectionAdapter;
    private static getSelectionColumnDesc;
    private loadSelectionColumnData;
}
