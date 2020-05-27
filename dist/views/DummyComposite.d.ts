import { ATableView } from 'tdp_core/src/views/ATableView';
import { AView } from 'tdp_core/src/views/AView';
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
