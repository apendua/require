
AMDManager = function (options) {

  var manager = this,
      modules = {},
      notFoundHooks = [],
      listOfModules = [],
      loadingStack  = [];

  options = options || {};

  manager.onModuleNotFound = function (callback) {
    _.isFunction(callback) && notFoundHooks.push(callback);
  };

  manager.onModuleNotFound(options.onModuleNotFound);

  // taken from node.js path.js implementation
  var normalize = function (parts) {
    // if the path tries to go above the root, `up` ends up > 0
    var up = 0, i = 0, last;
    for (i = parts.length - 1; i >= 0; i--) {
      last = parts[i];
      if (last === '.') {
        parts.splice(i, 1);
      } else if (last === '..') {
        parts.splice(i, 1);
        up++;
      } else if (up) {
        parts.splice(i, 1);
        up--;
      }
    }
    return parts;
  };

  var relativeTo = function (parent) {
    var parts = _.initial(parent.split('/'));
    return function (name) {
      if (name.charAt(0) === '.') {
        return normalize(parts.concat(name.split('/'))).join('/');
      }
      return name;
    };
  };

  var getOrCreate = function (name) {
    return modules[name] = modules[name] || { name : name, call : [] };
  };

  manager.get = function (name) { return modules[name] && modules[name].data; };

  // TODO: do we need this one?
  manager.getModule = function (name) { return module[name] };

  manager.forEach = function (prefix, callback) {
    var regexp = new RegExp(prefix);
    _.each(listOfModules, function (module) {
      if (_.has(module, 'body') && regexp.test(module.name)) {
        callback.call({}, module, module.name);
      }
    });
  }

  // - resolve relative names
  // - require all dependecies
  // - finally call module body
  manager.load = function (module, action) { //XXX action can be undefined
    if (_.has(module, 'data')) {
      // it seems that the module has been already loaded
      _.isFunction(action) && action.call({}, module.data);
    } else {
      _.isFunction(action) && module.call.push(action); // call later
      if (!module.lock && _.has(module, 'body')) {
        module.lock = true;
        loadingStack.push(module.name);
        manager.require(_.map(module.deps, relativeTo(module.name)), function () {
          if (!_.has(module, 'data')) {
            // TODO: do we need nonreactive wrapper here?
            module.data = module.body.apply({}, arguments);
          }
          while (module.call.length > 0) {
            module.call.shift().call({}, module.data);
          }
        });
        loadingStack.pop();
        module.lock = false;
      } else {
        // module was not yet defined or it was locked
        if (module.lock) {
          console.warn('Circular dependency detected', loadingStack.join('->') + '->' + module.name + '; ',
              'dependencies for `' + module.name + '` cannot be resolved');
        } else {
          _.each(notFoundHooks, function (callback) {
            callback.call(manager, module);
          });
        }
      }
    }
  };

  manager.define = function (name, deps, body) {
    var module = getOrCreate(name);
    if (_.has(module, 'body')) {
      throw new Error('Module "' + name + '" is already defined.');
    }
    module.deps = deps;
    module.body = body;
    listOfModules.push(module); // for better iteration
    manager.load(module);
  };

  manager.require = function (deps, body) {
    var todo = deps.length, _deps = _.clone(deps);
    var resolve = function (data, i) {
      _deps[i] = data;
      if (--todo <= 0) {
        body.apply({}, _deps);
      }
    };
    if (deps.length === 0) {
      body.apply({});
    } else {
      _.each(deps, function (name, i) {
        manager.load(getOrCreate(name), function (data) {
          resolve(data, i);
        });
      });
    }
  };

};
