/**
 * Created by Samuel Gratzl on 27.04.2016.
 */
import '../scss/style.scss';
import { AD3View } from 'tdp_core';
export declare class DummyDetailView extends AD3View {
    private readonly x;
    private readonly y;
    private readonly xAxis;
    private readonly yAxis;
    protected initImpl(): Promise<{
        value1: number;
        value2: number;
    }[]>;
    private build;
    private updateChart;
    selectionChanged(): void;
    private update;
}
