/* jshint evil:true */

/*
 * # KayClass
 *
 * > Copyright © Kay Framework Team
 * > KayClass may be freely distributed under the MIT license.
 * > For all details and documentation:
 * > http://github.com/kay-framework/kayclass
 */
(function () {
    'use strict';

    function extend(name, parent, prototypeProperties, staticProperties) {
        var child;
        var classDefinition;

        if (typeof parent !== 'function' && parent !== null) {
            classDefinition = Object.prototype.toString.call(parent);
            throw new TypeError('Class extends value ' +
                classDefinition + ' is not a function or null');
        }

        if (prototypeProperties && prototypeProperties.hasOwnProperty('constructor')) {
            child = prototypeProperties.constructor;
            if (child.name !== name) {
                throw new Error('Constructor name mismatch: ' + child.name + ', ' + name);
            }
        } else {
            child = construct(name, Boolean(parent));
        }

        if (parent) {
            assignProperties(child, parent);
            child.prototype = Object.create(parent.prototype, {
                constructor: {
                    value: child,
                    enumerable: false,
                    writable: true,
                    configurable: true
                },
            });
        }

        if (staticProperties) {
            assignProperties(child, staticProperties, ensureFunctionAssignment);
        }

        if (prototypeProperties) {
            assignProperties(child.prototype, prototypeProperties, ensureFunctionAssignment);
        }

        return child;
    }

    function ensureFunctionAssignment(name, property) {
        if (hasFunction(property) === false) {
            throw new TypeError('Unexpected property value for `' +
                name + '`. Only function, get, or set allowed');
        }
    }

    function hasFunction(property) {
        var hasFunctionValue = typeof property.value === 'function';
        var hasSetterFunction = typeof property.set === 'function';
        var hasGetterFunction = typeof property.get === 'function';

        return hasFunctionValue || hasSetterFunction || hasGetterFunction;
    }

    function assignProperties(target, source, callback) {
        var sourceProperties = Object.getOwnPropertyNames(source);
        var targetPropertyDescriptor;
        var sourcePropertyDescriptor;

        sourceProperties.forEach(function (sourcePropertyName) {

            targetPropertyDescriptor = Object
                .getOwnPropertyDescriptor(target, sourcePropertyName);

            if (!targetPropertyDescriptor ||
                targetPropertyDescriptor.writable &&
                targetPropertyDescriptor.configurable) {

                sourcePropertyDescriptor = Object
                    .getOwnPropertyDescriptor(source, sourcePropertyName);

                if (typeof callback === 'function') {
                    callback(sourcePropertyName, sourcePropertyDescriptor);
                }

                sourcePropertyDescriptor.enumerable = false;
                Object.defineProperty(target, sourcePropertyName, sourcePropertyDescriptor);
            }
        });
    }

    function construct(name, callsSuper) {
        return new Function('Class', 'return function ' + name + '() { \n' +
         (callsSuper ? '    Class.super(' + name + ').constructor.apply(this, arguments);\n' : '') +
        '}')(Class);
    }

    function Class(name, prototypeProperties, staticProperties) {
        if (prototypeProperties) {
            return extend(name, null, prototypeProperties, staticProperties);
        } else {
            return { extends: extend.bind(this, name) };
        }
    }

    Class.super = function (constructor) {
        if (typeof constructor !== 'function' || !constructor.prototype) {
            throw new TypeError('Class.super must be called with a constructor');
        }
        return Object.getPrototypeOf(constructor.prototype);
    };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Class;
    } else {
        (typeof window !== 'undefined' ? window : global).Class = Class;
    }

})();
