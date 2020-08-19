/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */
//register all extensions in the registry following the given pattern
module.exports = function (registry, feature) {
    //registry.push('extension-type', 'extension-id', function() { return import('./src/extension_impl'); }, {});
    // generator-phovea:begin
    /// #if include('ordino')
    registry.push('ordinoStartMenuSection', 'dummy_start_a', function () {
        return import('./base/DummyMenuSection');
    }, {
        name: 'Dummy Data',
        factory: 'new DummyMenuSection',
        cssClass: 'targidDummyData',
        priority: 20,
        viewId: 'dummy_start_a',
        idType: 'IDTypeA'
    });
    /// #endif
    registry.push('tdpView', 'dummy_start_a', function () {
        return import('./views/DummyList').then((d) => d.DummyStartList);
    }, {
        name: 'Dummy A',
        factory: 'createStartA',
        idtype: 'IDTypeA',
        selection: 'none'
    });
    registry.push('tdpView', 'dummy_start_B', function () {
        return import('./views/DummyList').then((d) => d.DummyStartList);
    }, {
        name: 'Dummy B',
        factory: 'createStartB',
        idtype: 'IDTypeB',
        selection: 'none'
    });
    registry.push('tdpView', 'dummy_detail', function () {
        return import('./views/DummyDetailView');
    }, {
        name: 'Dummy Detail View',
        factory: 'new DummyDetailView',
        idtype: 'IDTypeA',
        selection: '2'
    });
    registry.push('tdpView', 'dummy_dependent', function () {
        return import('./views/DummyDependentList');
    }, {
        name: 'Dummy Dependent List',
        factory: 'new DummyDependentList',
        idtype: 'IDTypeA',
        selection: 'some'
    });
    registry.push('tdpView', 'dummyb_dependent', function () {
        return import('./views/DummyDependentBList');
    }, {
        name: 'Dummy Dependent List',
        factory: 'new DummyDependentBList',
        idtype: 'IDTypeB',
        selection: 'some'
    });
    registry.push('tdpView', 'dummy_composite', function () {
        return import('tdp_core/dist/views/CompositeView');
    }, {
        name: 'DummyComposite',
        factory: 'new CompositeView',
        idtype: 'IDTypeA',
        selection: 'some',
        elements: [
            {
                key: 'a',
                loader() {
                    return import('./views/DummyComposite');
                },
                factory: 'new DummyA'
            },
            {
                key: 'b',
                loader() {
                    return import('./views/DummyComposite');
                },
                factory: 'new DummyB'
            },
            {
                key: 'c',
                loader() {
                    return import('./views/DummyComposite');
                },
                factory: 'new DummyC'
            }
        ],
        layout: {
            type: 'vsplit',
            keys: ['a', { type: 'hsplit', keys: ['b', 'c'] }]
        }
    });
    registry.push('tdpView', 'dummy_external', function () {
        return import('tdp_core/dist/views/ProxyView');
    }, {
        name: 'Wikipedia',
        factory: 'new ProxyView',
        site: 'https://wikipedia.org/w/index.php?search={id}',
        argument: 'id',
        idtype: 'IDTypeA',
        selection: 'chooser'
    });
    registry.push('tdpInstantView', 'dummy', function () {
        return import('./views/DummyInstantView');
    }, {
        name: 'Info',
        factory: 'new DummyInstantView',
        idtype: 'IDTypeA'
    });
    registry.push('tdpScore', 'dummy_score', function () {
        return import('./scores/DummyScore').then((d) => d.DummyScore);
    }, {
        name: 'Dummy Score',
        idtype: 'IDTypeA'
    });
    registry.push('tdpScoreImpl', 'dummy_score', function () {
        return import('./scores/DummyScore').then((d) => d.DummyScore);
    }, {
        factory: 'createScore'
    });
    registry.push('dTilesSearchProvider', 'dummyA', function () {
        return import('./base/DummySearchProvider').then((d) => d.DummySearchProvider);
    }, {
        idType: 'IDTypeA',
        factory: 'createA'
    });
    registry.push('dTilesSearchProvider', 'dummyB', function () {
        return import('./base/DummySearchProvider').then((d) => d.DummySearchProvider);
    }, {
        idType: 'IDTypeB',
        factory: 'createB'
    });
    // generator-phovea:end
};
//# sourceMappingURL=phovea.js.map