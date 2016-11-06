/* *****************************************************************************
 * Caleydo - Visualization for Molecular Biology - http://caleydo.org
 * Copyright (c) The Caleydo Team. All rights reserved.
 * Licensed under the new BSD license, available at http://caleydo.org/license
 **************************************************************************** */

//register all extensions in the registry following the given pattern
module.exports = function(registry) {
  //registry.push('extension-type', 'extension-id', function() { return System.import('./src/extension_impl'); }, {});
  // generator-phovea:begin
  registry.push('targidView', 'dummy_start_a', function() { return System.import('./src/DummyList'); }, {
  'name': 'Dummy A',
  'factory': 'createStartA',
  'idtype': 'IDTypeA',
  'selection': 'none'
 });

  registry.push('targidStartEntryPoint', 'dummy_start_a', function() { return System.import('./src/DummyEntryPoint'); }, {
  'name': 'Dummy A',
  'factory': 'createStartFactory',
  'viewId': 'dummy_start_a',
  'idtype': 'IDTypeA'
 });

  registry.push('targidView', 'dummy_start_B', function() { return System.import('./src/DummyList'); }, {
  'name': 'Dummy B',
  'factory': 'createStartB',
  'idtype': 'IDTypeB',
  'selection': 'none'
 });

  registry.push('targidView', 'dummy_detail', function() { return System.import('./src/DummyDetailView'); }, {
  'name': 'Dummy Detail View',
  'category': 'static',
  'idtype': 'IDTypeA',
  'selection': '2'
 });

  registry.push('targidView', 'dummy_dependent', function() { return System.import('./src/DummyDependentList'); }, {
  'name': 'Dummy Dependent List',
  'category': 'dynamic',
  'factory': 'create',
  'idtype': 'IDTypeA',
  'selection': 'single'
 });

  registry.push('targidView', 'dummy_external', function() { return System.import('targid2/src/ProxyView'); }, {
  'name': 'DuckDuckGo',
  'folder': 'targid2',
  'category': 'static',
  'site': 'https://duckduckgo.com/?q={id}',
  'argument': 'id',
  'idtype': 'IDTypeA',
  'selection': 'multiple'
 });

  registry.push('targidScore', 'dummy_score', function() { return System.import('./src/DummyScore'); }, {
  'name': 'Dummy Score',
  'idtype': 'IDTypeA'
 });
  // generator-phovea:end
};

