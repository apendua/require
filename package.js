
Package.describe({
    summary: "A simple tool to define/require modules with dependencies",
});

Package.on_use(function (api) {
    api.use('underscore', ['client', 'server']);
    api.add_files('require.js', ['client', 'server']);
    api.export('require');
    api.export('define');
});
