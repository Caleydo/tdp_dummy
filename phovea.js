/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function (registry) {
  //registry.push('extension-type', 'extension-id', function() { return import('./src/extension_impl'); }, {});
  // generator-phovea:begin
  registry.push('tdpView', 'dummy_start_a', function () {
    return import('./src/entries/DummyList');
  }, {
    'name': 'Dummy A',
    'factory': 'createStartA',
    'idtype': 'IDTypeA',
    'selection': 'none'
  });

  registry.push('ordinoStartMenuSection', 'dummy_start_a', function () {
    return System.import('./src/entries/DummyEntryPoint');
  }, {
    'name': 'Dummy Data',
    'cssClass': 'targidDummyData',
    'factory': 'createStartFactory',
    'priority': 20,
    'viewId': 'dummy_start_a',
    'idtype': 'IDTypeA'
  });

  registry.push('tdpView', 'dummy_start_B', function () {
    return import('./src/entries/DummyList');
  }, {
    'name': 'Dummy B',
    'factory': 'createStartB',
    'idtype': 'IDTypeB',
    'selection': 'none'
  });

  registry.push('tdpView', 'dummy_detail', function () {
    return import('./src/views/DummyDetailView');
  }, {
    'name': 'Dummy Detail View',
    'factory': 'new',
    'idtype': 'IDTypeA',
    'selection': '2'
  });

  registry.push('tdpView', 'dummy_dependent', function () {
    return import('./src/views/DummyDependentList');
  }, {
    'name': 'Dummy Dependent List',
    'factory': 'new',
    'idtype': 'IDTypeA',
    'selection': 'single'
  });

  registry.push('tdpView', 'dummy_external', function () {
    return import('tdp_core/src/views/ProxyView');
  }, {
    'name': 'DuckDuckGo',
    'site': 'https://duckduckgo.com/?q={id}',
    'argument': 'id',
    'idtype': 'IDTypeA',
    'selection': 'chooser'
  });

  registry.push('tdpScore', 'dummy_score', function () {
    return import('./src/scores/DummyScore');
  }, {
    'name': 'Dummy Score',
    'idtype': 'IDTypeA'
  });
  registry.push('tdpScoreImpl', 'dummy_score', function () {
    return import('./src/scores/DummyScore');
  }, {
    factory: 'createScore'
  });


  registry.push('bobSearchProvider', 'dummy', function () {
    return import('./src/entries/DummySearchProvider')
  }, {
    idType: 'IDTypeA',
    factory: 'createA'
  });


  registry.push('bobSearchProvider', 'dummy', function () {
    return import('./src/entries/DummySearchProvider')
  }, {
    idType: 'IDTypeB',
    factory: 'createB'
  });
  // generator-phovea:end
};

