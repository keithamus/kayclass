
# KayClass

> Copyright © 2013 Kay Framework Team
> KayClass may be freely distributed under the MIT license.
> For all details and documentation:
> http://github.com/kayframework/kayClass

KayClass is a simple Class implementation inspired by Backbone, but using
ES5 features. This means it copies property values such as enumerability and
writability across classes. It also has proper prototypal inheritence using
Object.create.

When used in Node.JS it will extend from Node's EventEmitter, allowing you to
have events baked into every class you create. When in the browser it uses
a port of Node's EventEmitter, giving you the same flexibility on the
frontend, as in the backend.

It is more comprehensive than a simple `util.inherits()` in Node.JS, as it
allows you to cleanly express additional prototype & static properties, and
also inherits static properties from the parent class. You also get a `super`
static property on your class, which references the parent, allowing you to
programatically call the parent methods without referincing it directly.

### Usage

Note:
When running in Node.JS, KayClass extends from
[Node.JS' Eventemitter](http://nodejs.org/api/events.html), when in the
browser, it has a functionality identical browser port of EventEmitter, see
[eventemitter-browser.js](./eventemitter-browser.js).




KayClass

Public: The KayClass constructor. Does nothing by itself really,
        but use the static .extend() method to extend it to your
        hearts content.

Examples

    var Class = require('kayclass');
    AThing = Class.extend({
        someProtoProp: 1,
        anotherProtoProp: 'hi',
        someProtoMethod: function () { }
        anotherProtoMethod: function () { }

    });
    AnotherThing = AThing.extend({
        constructor: function () {},
        someProtoMethod: function () {
            AnotherThing.super.someProtoMethod.call(this);
        }
    }, {
        staticProperty: true
    });
    assert(AnotherThing instanceof AThing); // true
    assert(AThing instanceof Class); // true
    assert(AThing.prototype.someProtoMethod !==
        AnotherThing.prototype.someProtoMethod); // true



KayClass.extend

Public: Creates a new Class which inherits from `this`, adding
        the properties from `protoProps` to the prototype, and the
        properties from `staticProps` to the constructor as static
        methods

protoProps  - An Object of properties to add to the prototype
staticProps - An Object of properties to add to the constructor

Examples

    Person = KayClass.extend({ name: 'Bob' });
    (new Person).name // => 'Bob'
    OtherPerson = Person.extend({ name: 'Sue', age: 21 });
    (new OtherPerson).name // => 'Sue'
    (new OtherPerson).age // => '21'

Returns a new Class.

