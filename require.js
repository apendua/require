/**
 * @author apendua / apendua@gmail.com
 */

(function () {
    // modules loading stack
    var stack = [];
    // modules cache
    var modules = {};
     // for meteor dependencies
    var dependency = {};
    // do we have meteor on the board?
    var hasDepsModule = typeof Deps !== 'undefined';
    // get or create a module with a given name
    var get = function (name) { return modules[name] = modules[name] || { name: name, call: [] } };
    // load (i.e. call module body function)
    var load = function (module, action) {
        // check for circular dependencies
        if (module.lock && _.indexOf(stack, module.name) >= 0)
            console.log('WARNING: circular dependency detected', stack.join('->'), '->', module.name, '; ',
                'dependencies for module `', module.name, '` cannot be resolved');
        if (_.has(module, 'data')) {
            // it seems that the module has been already loaded
            if (_.isFunction(action))
                action.call(undefined, module.data);
        } else {
            // this action will be called
            // after the module is loaded
            if (_.isFunction(action))
                module.call.push(action);
            // only proceed if the module is already defined
            // and it's the first time the load function is called
            if (!module.lock && _.has(module, 'body')) {
                module.lock = true; // make sure we won't do this again
                stack.push(module.name);
                require(module.deps, function () {
                    var args = arguments;
                    if (hasDepsModule)
                        Deps.nonreactive(function () {
                            // load the module inside an isolated environment since
                            // we don't want any module to be defined within a computation
                            module.data = module.body.apply(undefined, args);
                        });
                    else // if no meteor's present, just call the module's body
                        module.data = module.body.apply(undefined, args);
                    // tell that the module status has changed
                    // (note: if no Deps present, this will be undefined)
                    if (dependency[module.name])
                        dependency[module.name].changed();
                    // trigger all postponed actions
                    _.each(module.call, function (action) {
                        action.call(undefined, module.data);
                    });
                });
                stack.pop();
            }
        }
    };

    define = function (name, deps, body) {
        var module = get(name);
        if (_.has(module, 'body'))
            throw new Error('ERROR: module `' + name + '` already defined');
        module.deps = deps;
        module.body = body;
        // only load module if somebody requires it
        if (module.call.length > 0) load(module);
    };
    
    require = function (deps, body) {
        if (_.isString(deps)) {
            if (!_.isFunction(body)) {
                // this is one parameter version of require call
                var module = get(deps);
                if (hasDepsModule)
                    // establish meteor dependency
                    Deps.depend(dependency[deps] = dependency[deps] || new Deps.Dependency);
                // try loading module with fake callback to tell that we actually require it
                load(module, function (){});
                // this may be still undefined
                return module.data;
            }
            deps = [deps, ];
        }
        if (deps.length === 0 && _.isFunction(body)){
            // no dependencies, so run immediately
            body.apply(undefined, deps);
        }
        // prepare for resolving dependencies
        var todo = deps.length, _deps = _.clone(deps);
        var resolve = function (data, i) {
            _deps[i] = data;
            if (--todo <= 0 && _.isFunction(body)){
                // everything is resolved now, so we can process the body of our request
                body.apply(undefined, _deps);
            }
        };
        _.each(deps, function (name, i) {
            load(get(name), function (data) {
                // when the module is loaded, mark it as resolved
                resolve(data, i);
            });
        });
    };
})();

