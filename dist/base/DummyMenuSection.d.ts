/**
 * Created by Holger Stitz on 10.08.2016.
 */
import { IPluginDesc } from 'phovea_core';
import { INamedSet } from 'tdp_core';
import { IStartMenuSection, IStartMenuSectionOptions } from 'ordino';
export declare class DummyMenuSection implements IStartMenuSection {
    readonly desc: IPluginDesc;
    private readonly idType;
    private readonly list;
    constructor(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuSectionOptions);
    push(namedSet: INamedSet): boolean;
}
