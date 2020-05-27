/**
 * Created by Holger Stitz on 10.08.2016.
 */

import {IPluginDesc} from 'phovea_core/src/plugin';
import {categories} from '../config';
import {INamedSet} from 'tdp_core/src/storage';
import {IStartMenuSection, IStartMenuSectionOptions} from 'ordino/src/extensions';
import {resolve} from 'phovea_core/src/idtype';
import {NamedSetList} from 'tdp_core/src/storage/NamedSetList';

export class DummyMenuSection implements IStartMenuSection {
  private readonly idType = resolve('IDTypeA');
  private readonly list: NamedSetList;

  constructor(parent: HTMLElement, public readonly desc: IPluginDesc, options: IStartMenuSectionOptions) {

    const createSession = (namedSet: INamedSet) => {
      if (options.session) {
        options.session((<any>this.desc).viewId, {namedSet}, {});
      } else {
        console.error('no session factory object given to push new view');
      }
    };
    this.list = new NamedSetList(this.idType, createSession, parent.ownerDocument);

    // read species
    const species: string[] = categories.slice(0);
    species.unshift('all');

    // convert species to namedset
    this.list.push(...species.map((d) => {
      return <INamedSet>{
        name: d,
        description: '',
        idType: '',
        ids: '',
        subTypeKey: 'cat',
        subTypeValue: d,
        creator: ''
      };
    }));

    parent.appendChild(this.list.node);
  }

  push(namedSet: INamedSet) {
    if (namedSet.idType !== this.idType.id) {
      return false;
    }
    this.list.push(namedSet);
    return true;
  }
}
