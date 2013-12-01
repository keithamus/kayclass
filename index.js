/*
 * # K-Class
 *
 * > Copyright © 2013 Kay Framework Team
 * > K-Doc may be freely distributed under the MIT license.
 * > For all details and documentation:
 * > http://github.com/kayframework/k-doc
 *
 * K-Class is a simple Class implementation inspired by Backbon, but using
 * ES5 features. This means it copies property values such as enumerability and
 * writability across classes. It also has proper prototypal inheritence using
 * Object.create.
 *
 * When used in Node.JS it will extend from Node's EventEmitter, allowing you to
 * have events baked into every class you create. When in the browser it uses
 * a port of Node's EventEmitter, giving you the same flexibility on the
 * frontend, as in the backend.
 *
 * It is more comprehensive than a simple `util.inherits()` in Node, as it
 * allows you to cleanly express additional prototype & static properties, and
 * also inherits static properties from the parent class. You also get a `super`
 * static property on your class, which references the parent, allowing you to
 * programatically call the parent methods without referincing it directly.
 *
 * ### Usage
 *
 * Note:
 * When running in Node.JS, K-Class extends from
 * [Node.JS' Eventemitter](http://nodejs.org/api/events.html), when in the
 * browser, it has a functionality identical browser port of EventEmitter, see
 * [eventemitter-browser.js](./eventemitter-browser.js).
 *
 *
 */
(function () {
    'use strict';
    // Shortcuts for Object.* methods, used frequently.
    var prop = Object.defineProperty,
        getPropDesc = Object.getOwnPropertyDescriptor,
        global = (typeof window !== 'undefined' ? window : global),
        EventEmitter,
        KClass;

    // Try to include EventEmitter the Node.JS way, falling back to taking it
    // from the global scope.
    try {
        EventEmitter = require('events').EventEmitter;
    } catch (error) {
        EventEmitter = global.EventEmitter;
    }

    // `extendProps` is a method to copy property definitions from a `from`
    // object to a `onto` object. It uses Object.getOwnPropertyDescriptor, which
    // means it can also copy getter and setter functions (rather than copying
    // their values). Also, it uses Object.getOwnPropertyNames meaning it can
    // get non-enumerable properties and copy those over too.
    function extendProps(onto, from) {
        var props = Object.getOwnPropertyNames(from),
            replace,
            i;
        for (i = 0; i < props.length; ++i) {
            replace = getPropDesc(onto, props[i]);
            if (!(props[i] in Function) && (!replace || replace.writable)) {
                prop(onto, props[i], getPropDesc(from, props[i]));
            }
        }
    }

    function extend(parent, protoProps, staticProps) {
        var child;
        // If protoProps has a `constructor` function then this should be used
        // as the basis of the child class, but if it doesn't then a use a
        // default function (`subClass`) which simply calls `.super`. In most
        // cases you will want to provide a custom constructor.
        if (protoProps && protoProps.hasOwnProperty('constructor')) {
            child = protoProps.constructor;
        } else {
            child = function subClass() {
                return child.super.apply(this, arguments);
            };
        }
        // Add ".super" static to child. This references the parent class, which
        // allows you to call the super class functions inside the child class
        // functions
        prop(child, 'super', { value: parent });
        // Extend all static props from the parent class, onto the child, and
        // from the `staticProps` object. `staticProps` comes last so you can
        // override parent class static properties.
        extendProps(child, parent);
        if (staticProps) {
            extendProps(child, staticProps);
        }
        // Object.create will create an `instanceof` reference to the parent,
        // meaning `child instanceof parent` works. It takes an optional set of
        // values. The constructor is composed back into the `child.prototype`
        // here because if it was not supplied in `protoProps` it will not be
        // available in the prototype (up until now)
        child.prototype = Object.create(parent.prototype, {
            constructor: {
                value: child,
                enumerable: false,
                writable: true,
                configurable: true
            },
        });
        // Finally extend all `protoProps` onto the child.
        if (protoProps) {
            extendProps(child.prototype, protoProps);
        }
        return child;
    }

    KClass = extend(EventEmitter, {
        /*
         * KClass
         *
         * Public: The K-Class constructor. Does nothing by itself really,
         *         but use the static .extend() method to extend it to your
         *         hearts content.
         *
         * Examples
         *
         *     var Class = require('k-class');
         *     AThing = Class.extend({
         *         someProtoProp: 1,
         *         anotherProtoProp: 'hi',
         *         someProtoMethod: function () { }
         *         anotherProtoMethod: function () { }
         *
         *     });
         *     AnotherThing = AThing.extend({
         *         constructor: function () {},
         *         someProtoMethod: function () {
         *             AnotherThing.super.someProtoMethod.call(this);
         *         }
         *     }, {
         *         staticProperty: true
         *     });
         *     assert(AnotherThing instanceof AThing); // true
         *     assert(AThing instanceof Class); // true
         *     assert(AThing.prototype.someProtoMethod !==
         *         AnotherThing.prototype.someProtoMethod); // true
         *
         */
        constructor: function KClass() {
            KClass.super.call(this);
        },
        off: function off(name, callback) {
            if (callback === undefined) {
                return this.removeAllListeners(name);
            } else {
                return this.removeListener(name, callback);
            }
        }
    });
    // Node.JS EventEmitter has some static properties that KClass shouldn't
    delete KClass.EventEmitter;
    delete KClass.listenerCount;

    // The `.extend` function is a non-enumerable static property on K-Class
    // which is the crux of the Class system. `.extend` always results in a new
    // child class, which is a parent of the class it is being called from.
    prop(KClass, 'extend', {
        configurable: true,
        writable: true,
        /*
         * KClass.extend
         *
         * Public: Creates a new Class which inherits from `this`, adding
         *         the properties from `protoProps` to the prototype, and the
         *         properties from `staticProps` to the constructor as static
         *         methods
         *
         * protoProps  - An Object of properties to add to the prototype
         * staticProps - An Object of properties to add to the constructor
         *
         * Examples
         *
         *     Person = KClass.extend({ name: 'Bob' });
         *     (new Person).name // => 'Bob'
         *     OtherPerson = Person.extend({ name: 'Sue', age: 21 });
         *     (new OtherPerson).name // => 'Sue'
         *     (new OtherPerson).age // => '21'
         *
         * Returns a new Class.
         */
        value: function KClassExtend(protoProps, staticProps) {
            return extend(this, protoProps, staticProps);
        },
    });

    // Exporting
    // ---------

    // Export out K-Class into a module.exports module (for Node)
    // or a property on the window object (for Browsers)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = KClass;
    } else {
        global.KClass = KClass;
    }

})();
