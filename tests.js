Tinytest.add('Require - simple define/require routine', function (test) {

  var manager = new AMDManager(),
      require = manager.require,
      define  = manager.define;

  require(['a', 'b'], function (a, b) {
    test.equal(a, 1);
    test.equal(b, 2);
  });

  define('b', ['a', ], function () {
    return 2;
  });

  define('a', [], function () {
    return 1;
  });

});

Tinytest.add('Require - relative paths', function (test) {

  var manager = new AMDManager(),
      require = manager.require,
      define  = manager.define,
      loaded  = false;

  require(['path/to2/d'], function (d) {
    loaded = true;
    test.equal(d, 25);
  });

  define('path/to/b', ['./a', '../c', '../../path/to2/../to2/e'], function (a, c, e) {
    return a + c + e; // 6
  });

  define('path/to/a', [], function () {
    return 1;
  });

  define('path/c', ['./to/a'], function (a) {
    return 1 + 2 * a; // 3
  });

  define('path/to2/d', ['../to/b'], function (b) {
    return 4 * b + 1; // 25
  });

  define('path/to2/e', ['../to/a'], function (a) {
    return a + 1; // 2
  });

  test.equal(loaded, true);

});


Tinytest.add('Require - module not found', function (test) {

  var manager = new AMDManager({
        onModuleNotFound: function () {
          notFound++;
        },
      }),
      require  = manager.require,
      define   = manager.define,
      notFound = 0;

  manager.onModuleNotFound(function () {
    notFound++;
  });

  require(['a', 'b', 'c']);

  define('a', ['b', 'c'], function () {

  });

  test.equal(notFound, 10);

});


Tinytest.add('Require - circular dependencies', function (test) {

  var manager = new AMDManager(),
      require = manager.require,
      define  = manager.define,
      loaded  = false;

  define('a', ['b'], function () {

  });

  define('b', ['c'], function () {

  });

  define('c', ['a'], function () {

  });

  require('a', function () {
    loaded = true;
  })

  test.equal(loaded, false);

});

