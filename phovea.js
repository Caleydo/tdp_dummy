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
    return import('./src/DummyMenuSection');
  }, {
     name: 'Dummy Data',
     cssClass: 'targidDummyData',
     priority: 20,
     viewId: 'dummy_start_a',
     idType: 'IDTypeA'
  });
  /// #endif

  registry.push('tdpView', 'dummy_start_a', function () {
    return import('./src/views/DummyList');
  }, {
     name: 'Dummy A',
     factory: 'createStartA',
     idtype: 'IDTypeA',
     selection: 'none'
  });

  registry.push('tdpView', 'dummy_start_B', function () {
    return import('./src/views/DummyList');
  }, {
     name: 'Dummy B',
     factory: 'createStartB',
     idtype: 'IDTypeB',
     selection: 'none'
  });

  registry.push('tdpView', 'dummy_detail', function () {
    return import('./src/views/DummyDetailView');
  }, {
     name: 'Dummy Detail View',
     idtype: 'IDTypeA',
     selection: '2'
  });

  registry.push('tdpView', 'dummy_dependent', function () {
    return import('./src/views/DummyDependentList');
  }, {
     name: 'Dummy Dependent List',
     idtype: 'IDTypeA',
     selection: 'some'
  });

  registry.push('tdpView', 'dummyb_dependent', function () {
    return import('./src/views/DummyDependentBList');
  }, {
     name: 'Dummy Dependent List',
     idtype: 'IDTypeB',
     selection: 'some'
  });

  registry.push('tdpView', 'dummy_external', function () {
    return import('tdp_core/src/views/ProxyView');
  }, {
     name: 'DuckDuckGo',
     site: 'https://duckduckgo.com/?q={id}',
     argument: 'id',
     idtype: 'IDTypeA',
     selection: 'chooser'
  });

  registry.push('tdpScore', 'dummy_score', function () {
    return import('./src/scores/DummyScore');
  }, {
     name: 'Dummy Score',
     idtype: 'IDTypeA'
  });
  registry.push('tdpScoreImpl', 'dummy_score', function () {
    return import('./src/scores/DummyScore');
  }, {
    factory: 'createScore'
  });


  /// #if include('dTiles')
  registry.push('dTilesSearchProvider', 'dummyA', function () {
    return import('./src/DummySearchProvider')
  }, {
    idType: 'IDTypeA',
    factory: 'createA'
  });


  registry.push('dTilesSearchProvider', 'dummyB', function () {
    return import('./src/DummySearchProvider')
  }, {
    idType: 'IDTypeB',
    factory: 'createB'
  });
  /// #endif
  // generator-phovea:end
};

