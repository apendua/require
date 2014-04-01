
Package.describe({
  summary: "A simple tool to define/require modules with dependencies",
});

Package.on_use(function (api) {
  api.use(['deps', 'underscore'], ['client', 'server']);
  
  api.add_files([

    'manager.js',
    'require.js',

  ], ['client', 'server']);

  if (api.export !== undefined) {
    api.export('AMDManager', ['client', 'server']);
    api.export('define', ['client', 'server']);
    api.export('require', ['client', 'server']);
  }
});
