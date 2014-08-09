
Package.describe({
  summary: "A simple tool to define/require modules with dependencies",
});

Package.on_use(function (api) {
  api.use(['deps', 'underscore', 'amd-manager'], ['client', 'server']);
  
  api.add_files([

    'require.js',

  ], ['client', 'server']);

  if (api.export !== undefined) {
    api.export('define', ['client', 'server']);
    api.export('require', ['client', 'server']);
  }
});


Package.on_test(function (api) {
  // ENVIRONMENT
  api.use(['amd-manager', 'tinytest'], ['client', 'server']);

  // TESTS
  api.add_files([
    'tests.js',
  ], 'client');
});
