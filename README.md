# Require

This is an ultra simple tool allows you to split your javascript
code into separate modules and define dependency relations between them
to ensure, that the code will be executed in the right order. This is
particulary useful in environments (e.g. [Meteor](http://meteor.com)),
that do not provide satisfactory control on the order in which
the files containing your source code are loaded.
Or maybe you can control it but you don't want to bother.

## Isn't it a clone of `requirejs`?

This is a custom implementation of the core features only
(e.g. `ajax` file loading is not included)
of the famous [requirejs](http://requirejs.org) library.
So, if you think that `requirejs` might be a little to heavy
for your project use `require` :)

## API

To use `require` in your own project make sure that the file `require.js`
is loaded as soon as possible. 

#define

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

#require

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
