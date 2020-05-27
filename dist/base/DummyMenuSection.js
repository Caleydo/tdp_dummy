/**
 * Created by Holger Stitz on 10.08.2016.
 */
import { categories } from '../config';
import { resolve } from 'phovea_core';
import { NamedSetList } from 'tdp_core';
export class DummyMenuSection {
    constructor(parent, desc, options) {
        this.desc = desc;
        this.idType = resolve('IDTypeA');
        const createSession = (namedSet) => {
            if (options.session) {
                options.session(this.desc.viewId, { namedSet }, {});
            }
            else {
                console.error('no session factory object given to push new view');
            }
        };
        this.list = new NamedSetList(this.idType, createSession, parent.ownerDocument);
        // read species
        const species = categories.slice(0);
        species.unshift('all');
        // convert species to namedset
        this.list.push(...species.map((d) => {
            return {
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
    push(namedSet) {
        if (namedSet.idType !== this.idType.id) {
            return false;
        }
        this.list.push(namedSet);
        return true;
    }
}
//# sourceMappingURL=DummyMenuSection.js.map