const createModules = function() {
    modulesStorage = {}

    define = function(moduleName, dependencies = [], declarationFunction ) {
        modulesStorage[moduleName] = {
            moduleName,
            df: declarationFunction,
            dependencies: dependencies,
            value: null
        }
    }

    require = function(dependencies = [], successCallback) {
        const context = [];

        if(!Array.isArray(dependencies) || dependencies.length == 0) {
            successCallback()
            return
        }

        const promises = dependencies.map(dep => {
            if(typeof dep !== 'string') {
                console.error('Bad-format dependencies property: ', `${typeof dep} is not a string`);
                return null
            }
            if(!modulesStorage[dep]) {
                console.error('Not defined: ', `dependency ${dep} was not defined. Use define function first`);
                return null
            }
            
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
                    context.push(modulesStorage[result.value]?.value)
                }
            )
        ).then(() => { 
            console.log(context);
            successCallback.apply(null, context);
        })
    }

    return {
        define: define,
        require: require
    }
}

module.exports = { createModules }