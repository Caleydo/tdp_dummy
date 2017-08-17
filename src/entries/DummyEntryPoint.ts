/**
 * Created by Holger Stitz on 10.08.2016.
 */

import {IPluginDesc} from 'phovea_core/src/plugin';
import {IEntryPointList, AEntryPointList, IStartMenuSectionEntry, IStartMenuOptions} from 'ordino/src/StartMenu';
import {categories, dataSourceA} from '../config';
import {INamedSet} from 'ordino/src/storage';

export default class DummySelector extends AEntryPointList implements IStartMenuSectionEntry {
  /**
   * Set the idType and the default data and build the list
   * @param parent
   * @param desc
   * @param options
   */
  constructor(parent: HTMLElement, desc: IPluginDesc, options: IStartMenuOptions) {
    super(parent, desc, options);

    this.idType = dataSourceA.idType;

    // read species
    const species: string[] = categories.slice(0);
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
