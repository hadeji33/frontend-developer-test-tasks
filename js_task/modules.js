const createModules = function() {
    modulesStorage = {}
    dependenciesStorage = []

    define = function(moduleName, dependencies = [], declarationFunction ) {
        modulesStorage[moduleName] = {
            moduleName,
            df: declarationFunction,
            dependencies: dependencies,
            value: null
        }
        dependenciesStorage = dependenciesStorage.concat(dependencies)
    }

    require = function(dependencies = [], successCallback) {
        const context = [];
        const promises = dependencies.map(dep => {
            return new Promise((resolve) => {
                modulesStorage[dep].df((a) => {
                    if(!modulesStorage[dep].value) {
                        modulesStorage[dep].value = a;
                    }
                    resolve(dep)
                })
            })
        });

        Promise.allSettled(promises).then(
            (results) => results.forEach(
                (result) => { 
                    context.push(modulesStorage[result.value].value)
                }
            )
        ).then(() => { 
            successCallback.apply(null, context);
        })
    }

    return {
        define: define,
        require: require
    }
}

module.exports = { createModules }