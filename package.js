
Package.describe({
    summary: "A simple tool to define/require modules with dependencies",
});

Package.on_use(function (api) {
    api.use('underscore', ['clinet', 'server']);
    api.add_files([
        'require.js',
    ], ['client', 'server']);
});
