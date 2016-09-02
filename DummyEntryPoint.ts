/**
 * Created by Holger Stitz on 10.08.2016.
 */

import {IPluginDesc} from '../caleydo_core/plugin';
import {IEntryPointList, AEntryPointList} from '../targid2/StartMenu';
import {gene_species} from './Configs';
import {INamedSet} from "../targid2/storage";

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
    var species:string[] = gene_species.slice(0);
    species.unshift('all');

    // convert species to namedset
    this.data = species.map((d) => {
      return <INamedSet>{
        name: d,
        description: '',
        idType: '',
        ids: '',
        subTypeKey: 'cat',
        subTypeValue: d,
        creator: ''
      };
    });

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
