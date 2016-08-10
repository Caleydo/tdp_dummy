/**
 * Created by Holger Stitz on 10.08.2016.
 */

import {IPluginDesc} from '../caleydo_core/plugin';
import {IEntryPointList, AEntryPointList} from '../targid2/StartMenu';
import {gene_species} from './Configs';

/**
 * Entry point list from all species and LineUp named sets (aka stored LineUp sessions)
 */
class DummyEntryPointList extends AEntryPointList {

  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(protected parent: HTMLElement, public desc: IPluginDesc, protected options:any) {
    super(parent, desc, options);

    this.idType = 'IDTypeA';

    // read species
    this.data = gene_species.map((d) => ({ type: 'cat', v: d}));
    this.data.unshift({type: 'all', v: 'All'});

    this.build();
  }
}

/**
 * Create a list for main navigation from all species and LineUp named sets (aka stored LineUp sessions)
 * @param parent
 * @param desc
 * @param options
 * @returns {function(): any}
 */
export function createStartFactory(parent: HTMLElement, desc: IPluginDesc, options:any):IEntryPointList {
  return new DummyEntryPointList(parent, desc, options);
}
