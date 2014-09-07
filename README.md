# require

This is an ultra simple tool which allows you to split your javascript
code into separate modules and define dependency relations between them.
This ensures, that the code will be executed in the right order. It may be
particulary useful in environments (e.g. [Meteor](http://meteor.com/)),
that do not provide satisfactory control on the order in which
the source files are being loaded.

## Isn't it just a clone of `requirejs`?

This is a custom implementation of the core features only
(e.g. `ajax` file loading is not included)
of the famous [requirejs](http://requirejs.org/) library.
So, if you think that `requirejs` might be a little to heavy
for your project use `require` :)

## Dependencies & Installation

At this moment `require.js` depends only on
`underscore.js` which we encourage you to use anyways
You can download your own copy of `underscore.js`
from [here](http://underscorejs.org/).
To use `require` in your own project make sure that
the file `require.js` is loaded after `underscore.js`
and before all your calls to `define` and `require`.

### Using with Meteor

The simplest way is to put `require.js` in `lib`
in the root directory of your project. Currently,
Meteor uses `underscore` by default, but if it changes
in the future, you can always run
```
meteor add underscore
```
to make sure everything works fine.

### Using with Meteorite

If you build your application using [meteorite](https://github.com/oortcloud/meteorite),
the only thing you will need to do is the following
```
mrt add define
```
Please note, that the name of the package is `define`, not `require`.

## API

###define

``` javascript
define(moduleName, dependecies, definingFunction) {...}
```

Use `define` to create a new module, e.g.

``` javascript
define('superCoolModule', [], function () {
  console.log('defining a super cool module ...');
  return {
    sayHi: function () {
      console.log("Hi, I'm a super cool module!");
    }
  }
});
```

The second parameter is a list of modules that need to be loaded prior
to `superCoolModule`(avoid dependency loops!).
If they're loaded successfully, those modules will be available
as the arguments of the function defining `superCoolModule`.
More preciselly, what will be available is what
their defining functions will return.

###require

``` javascript
require(dependecies, codeToRun) {...}
```

Use `require` to define a pice of code that depend on `superCoolModule`, e.g.

``` javascript
require('superCoolModule', function (superCoolModule) {
  superCoolModule.sayHi();
});
```

If your code depend on more than one module, use list

``` javascript
require(['superCoolModule', 'anotherCoolModule'], ... );
```

If you're sure that all your source code is already loaded
(e.g. this is quite reasonable in event callbacks),
you can also use a "synchronous" version of `require`, i.e.

``` javascript
superCoolModule = require('superCoolModule');
superCoolModule.sayHi();
```

Additionally, calling `require()` without callback
in Meteor environment turns it into a reactive data source.

## TODO

- solve the problem of anonymous modules
- https://github.com/amdjs/amdjs-api/wiki/AMD
- ~~allow modules with no dependencies~~
- ~~create tests~~
