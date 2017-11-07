> # No Longer Actively Maintained
> If someone would like to take over maintainence, feel free to get in touch ([@keithamus on twitter](https://twitter.com/keithamus)). I'll happily transfer this over.

[![kay-framework:core](https://img.shields.io/badge/kay--framework-core-blue.svg?style=flat-square)](https://github.com/kay-framework)
[![license:mit](https://img.shields.io/badge/license-mit-green.svg?style=flat-square)](http://kayframework.mit-license.org/)<br>
[![tag:?](https://img.shields.io/github/tag/kay-framework/kayclass.svg?style=flat-square)](https://github.com/kay-framework/kayclass/releases)
[![build:?](https://img.shields.io/travis/kay-framework/kayclass/master.svg?style=flat-square)](https://travis-ci.org/kay-framework/kayclass)
[![coverage:?](https://img.shields.io/coveralls/kay-framework/kayclass/master.svg?style=flat-square)](https://coveralls.io/r/kay-framework/kayclass)<br>
[![npm:](https://img.shields.io/npm/v/kayclass.svg?style=flat-square)](https://www.npmjs.com/packages/kayclass)
[![dependencies:?](https://img.shields.io/npm/dm/kayclass.svg?style=flat-square)](https://www.npmjs.com/packages/kayclass)
[![devDependencies:?](https://img.shields.io/david/kay-framework/kayclass.svg?style=flat-square)](https://david-dm.org/kay-framework/kayclass)


# KayClass

> Copyright © Kay Framework Team
> KayClass may be freely distributed under the MIT license.
> For all details and documentation:
> http://github.com/kay-framework/kayclass

KayClass is a simple Class implementation inspired by and built to mimic
the ES6 class definition. It supports getter/setter prototype properties and
static properties are included in much the same way as with a Backbone.JS
class.

Prototype and static properties are inherited from the parent class, as well
as property values such as enumerability and writability.

Named classes can be extended, and named classes with a prototype
argument return the default constructor or the custom constructor - if
provided - which references the parent via Class.super.


### Usage

Class

Public: When a Class constructor is invoked with a name, proptotype and optional
        static properties, it returns a Constructor with the static properties,
        whose prototype is a composite of the prototype properties argument and
        any prototype properties of the parent.

Examples

```js
var Class = require('kayclass');

var MyClass = Class('MyClass', {
        protoFn: function () {},
        get thing() {},
        set thing(athing) {
            this.athing = thing;
        }
    }, {
        staticFn: function () {}
    });

var myClassInstance = new MyClass();

// inheritance
assert(myClassInstance instanceof MyClass); // true
assert(myClassInstance instanceof Class); // false
assert(MyClass.prototype.protoFn === myClassInstance.protoFn); // true
```


Class.extends

Public: When given only a name argument, Class returns an object with an extends function.
        The extends function takes another class, a prototype properties object, and an optional
        static properties object.

Examples

```js
var AnotherClass = Class('AnotherClass', {
        protoFn: function fn1() {},
        anotherProtoFn: function () {}
        get thing() {},
        set thing(athing) {
            this.athing = thing;
        }
    }, {
        staticFn: function () {}
    });

var MyClass = Class('MyClass').extends(AnotherClass, {
    protoFn: fn2() {},
    myProtoFn: function () {}
});

var myClassInstance = new MyClass();

// inheritance
assert(myClassInstance instanceof MyClass); // true
assert(myClassInstance instanceof AnotherClass); // true
assert(myClassInstance instanceof Class); // false

// child properties override parent properties of the same name
assert(myClassInstance.protoFn === '[Function: fn2]'); // true
// parent prototype properties are copied to the child prototype
assert(myClassInstance.anotherProtoFn === AnotherClass.prototype.anotherProtoFn); // true
// parent static properties are copied to the child
assert(MyClass.staticFn === AnotherClass.staticFn); // true


// Constructor/instance has a reference to its immediate parent via Class.super()
assert(Class.super(myClassInstance) === AnotherClass.prototype); // true
```
