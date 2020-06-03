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
    return import('./src/base/DummyMenuSection').then((d) => d.DummyMenuSection);
  }, {
     name: 'Dummy Data',
     cssClass: 'targidDummyData',
     priority: 20,
     viewId: 'dummy_start_a',
     idType: 'IDTypeA'
  });
  /// #endif

  registry.push('tdpView', 'dummy_start_a', function () {
    return import('./src/views/DummyList').then((d) => d.DummyStartList);
  }, {
     name: 'Dummy A',
     factory: 'createStartA',
     idtype: 'IDTypeA',
     selection: 'none'
  });

  registry.push('tdpView', 'dummy_start_B', function () {
    return import('./src/views/DummyList').then((d) => d.DummyStartList);
  }, {
     name: 'Dummy B',
     factory: 'createStartB',
     idtype: 'IDTypeB',
     selection: 'none'
  });

  registry.push('tdpView', 'dummy_detail', function () {
    return import('./src/views/DummyDetailView').then((d) => d.DummyDetailView);
  }, {
     name: 'Dummy Detail View',
     idtype: 'IDTypeA',
     selection: '2'
  });

  registry.push('tdpView', 'dummy_dependent', function () {
    return import('./src/views/DummyDependentList').then((d) => d.DummyDependentList);
  }, {
     name: 'Dummy Dependent List',
     idtype: 'IDTypeA',
     selection: 'some'
  });

  registry.push('tdpView', 'dummyb_dependent', function () {
    return import('./src/views/DummyDependentBList').then((d) => d.DummyDependentBList);
  }, {
     name: 'Dummy Dependent List',
     idtype: 'IDTypeB',
     selection: 'some'
  });

  registry.push('tdpView', 'dummy_composite', function () {
    return import('tdp_core/src/views/CompositeView').then((c) => c.CompositeView);
  }, {
     name: 'DummyComposite',
     idtype: 'IDTypeA',
     selection: 'some',
     elements: [
       {
         key: 'a',
         loader: function () {
           return import('./src/views/DummyComposite').then((d) => d.DummyA)
         },
         factory: 'new DummyA'
       },
       {
         key: 'b',
         loader: function () {
           return import('./src/views/DummyComposite').then((d) => d.DummyB)
         },
         factory: 'new DummyB'
       },
       {
         key: 'c',
         loader: function () {
           return import('./src/views/DummyComposite').then((d) => d.DummyC)
         },
         factory: 'new DummyC'
       }
     ],
    layout: {
      type: 'vsplit',
      keys: ['a', { type: 'hsplit', keys: ['b', 'c']}]
    }
  });

  registry.push('tdpView', 'dummy_external', function () {
    return import('tdp_core/src/views/ProxyView').then((p) => p.ProxyView);
  }, {
     name: 'Wikipedia',
     site: 'https://wikipedia.org/w/index.php?search={id}',
     argument: 'id',
     idtype: 'IDTypeA',
     selection: 'chooser'
  });

  registry.push('tdpInstantView', 'dummy', function () {
    return import('./src/views/DummyInstantView').then((d) => d.DummyInstantView);
  }, {
     name: 'Info',
     idtype: 'IDTypeA'
  });

  registry.push('tdpScore', 'dummy_score', function () {
    return import('./src/scores/DummyScore').then((d) => d.DummyScore);
  }, {
     name: 'Dummy Score',
     idtype: 'IDTypeA'
  });
  registry.push('tdpScoreImpl', 'dummy_score', function () {
    return import('./src/scores/DummyScore').then((d) => d.DummyScore);
  }, {
    factory: 'createScore'
  });

  registry.push('dTilesSearchProvider', 'dummyA', function () {
    return import('./src/base/DummySearchProvider').then((d) => d.DummySearchProvider)
  }, {
    idType: 'IDTypeA',
    factory: 'createA'
  });

  registry.push('dTilesSearchProvider', 'dummyB', function () {
    return import('./src/base/DummySearchProvider').then((d) => d.DummySearchProvider)
  }, {
    idType: 'IDTypeB',
    factory: 'createB'
  });
  // generator-phovea:end
};

