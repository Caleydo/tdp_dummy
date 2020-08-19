import { ATableView } from 'tdp_core';
import { AView } from 'tdp_core';
export declare class DummyA extends AView {
    initImpl(): void;
}
export declare class DummyB extends ATableView<any> {
    protected loadRows(): any[];
    protected sharedChanged(name: string): void;
}
export declare class DummyC extends AView {
    initImpl(): void;
}
