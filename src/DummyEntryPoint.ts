/**
 * Created by Holger Stitz on 10.08.2016.
 */

import {IPluginDesc} from 'phovea_core/src/plugin';
import {IEntryPointList, AEntryPointList, IStartMenuSectionEntry, IStartMenuOptions} from 'ordino/src/StartMenu';
import {categories} from './Configs';
import {INamedSet} from 'ordino/src/storage';

class DummySelector extends AEntryPointList implements IStartMenuSectionEntry {
  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(parent: HTMLElement, desc: IPluginDesc, options:IStartMenuOptions) {
    super(parent, desc, options);

    this.idType = 'IDTypeA';

    // read species
    const species:string[] = categories.slice(0);
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

  getEntryPointLists() {
    return [this];
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
  return new DummySelector(parent, desc, options);
}
