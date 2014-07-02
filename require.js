/**
 * @author apendua / apendua@gmail.com
 */

var manager      = new AMDManager(),
    dependencies = {};

// If the body is a function, we just call manager.require.
// If second argument is missing we make use of reactivity;
// as long as the first argument is just a string, we return
// (reactively) the data associated to the module. Otherwise,
// we return a handle with ready method which acts
// as a reactive data source (similar to subscription).
require = function (listOrName, body) {
  var readyDep, isReady;
  if (_.isFunction(body)) {
    if (!_.isArray(listOrName)) {
      listOrName = [listOrName, ];
    }
    return manager.require(listOrName, body);
  } else {
    if (_.isArray(listOrName)) {
      readyDep = new Deps.Dependency();
      manager.require(listOrName, function () {
        readyDep.changed();
        isReady = true;
      });
      return {
        ready: function () {
          readyDep.depend();
          return !!isReady;
        },
      }; // ready handle
    } else if (_.isString(listOrName)) {
      if (dependencies[listOrName] === undefined) {
        dependencies[listOrName] = new Deps.Dependency();
        manager.require([listOrName, ], function () {
          dependencies[listOrName].changed();
        });
      }
      dependencies[listOrName].depend();
      return manager.get(listOrName);
    }
  }
  
  // TODO: be more specific
  throw new Error('Wrong parameters for require.');
}

require.onModuleNotFound = manager.onModuleNotFound;

define = function (name, deps, body) {
  if (arguments.length == 2) {
    body = deps; deps = [];
  }
  manager.define(name, deps, body);
}

define.onModuleNotFound = manager.onModuleNotFound;
define.amd = true;
