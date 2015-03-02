/* jshint newcap:false */
/* jshint immed:false */

'use strict';
describe('Class', function () {

    var Class = typeof require === 'undefined' ? window.Class : require('../index.js');

    describe('given a `name` argument', function () {

        it('returns an object with an extends method', function () {

            var object = Class('MyClass');

            object
                .should.be.an('object');

            object.extends
                .should.be.a('function');

        });

    });

    describe('given `name`, `prototypeProperties` and `staticProperties` arguments', function () {

        var Constructor;

        beforeEach(function () {
            Constructor = Class('MyClass', {
                fn1: function () {},
                fn2: function () {}
            }, {
                staticFn1: function () {},
                staticProp: true
            });
        });

        it('returns a constructor function', function () {

            Constructor
                .should.be.a('function');

            (new Constructor())
                .should.be.an.instanceof(Constructor);

        });

        it('maps the `name` argument to the constructor function name', function () {

            Constructor.name
                .should.equal('MyClass');

        });

        it('copies the prototype methods to the function prototype', function () {

            Constructor.prototype.fn1
                .should.be.a('function');

            Constructor.prototype.fn2
                .should.be.a('function');

        });

        it('only allows functions, setters, and getters on the prototype', function () {

            (function () {
                Class('MyClass', {
                    set name(name) {
                        this._name = name;
                    },
                    prop1: 1,
                    get name() {
                        return this._name;
                    },
                    fnValue: function () {}
                });
            }).should
                .throw('Unexpected property value for `prop1`. Only function, get, or set allowed');

            (function () {
                Class('MyClass', {
                    set name(name) {
                        this._name = name;
                    },
                    get name() {
                        return this._name;
                    }
                });
            }).should
                .not.throw();

            (function () {
                Class('MyClass', {
                    get name() {
                        return this._name;
                    }
                });
            }).should
                .not.throw();

        });

        it('makes all prototype methods non-enumerable', function () {

            var myClass = new (Class('MyClass', {
                fn1: function () {},
                fn2: function () {},
            }))();

            Object.getPrototypeOf(myClass)
                .should.eql({});

        });

        it('copies the static properties to the function constructor', function () {

            Constructor.staticFn1
                .should.be.a('function');

            Constructor.staticProp
                .should.be.a('boolean');

        });

    });

    describe('given a custom constructor method', function () {

        it('throws an error if its name is different to the constructors name', function () {

            (function () {
                Class('MyClass', {
                    constructor : function YourClass() {}
                });
            }).should
                .throw('Constructor name mismatch: YourClass, MyClass');

        });

    });

    describe('without a custom constructor', function () {

        var ParentClass,
            ChildClass,
            instance;

        beforeEach(function () {

            ParentClass = Class('ParentClass', {});

            ChildClass = Class('ChildClass').extends(ParentClass, {
                aFn: function () {}
            }, {
                staticFn: function () {},
                staticProp: true,
            });

            this.spy(Class, 'super');
            this.spy(ParentClass.prototype, 'constructor');

            instance = new ChildClass(1, 2);
        });

        it('can be newed up', function () {

            instance
                .should.be.instanceof(ChildClass);

        });

        it('can have prototype methods', function () {

            instance.aFn
                .should.be.a('function')
                .and.equal(ChildClass.prototype.aFn);

        });

        it('can have static properties', function () {

            ChildClass.staticFn
                .should.be.a('function');

            ChildClass.staticProp
                .should.be.a('boolean');

        });

        it('calls super with the instance when instantiated', function () {

            Class.super
                .should.have.been.calledWith(ChildClass);

        });

        it('calls the default constructor method when instantiated', function () {

            Class.super(ChildClass).constructor
                .should.have.been.called;

        });

        it('maps arguments to its parent constructor', function () {

            Class.super(ChildClass).constructor
                .should.have.been.calledWith(1, 2);

        });

    });

    describe('with a custom constructor', function () {

        var ParentClass,
            ChildClass,
            instance;

        beforeEach(function () {

            ParentClass = Class('ParentClass', {
                constructor: function ParentClass() {}
            });

            ChildClass = Class('ChildClass').extends(ParentClass, {
                constructor: function ChildClass() {
                    Class.super(ChildClass).constructor();
                },
                aFn: function () {}
            }, {
                staticFn: function () {},
                staticProp: true,
            });

            this.spy(Class, 'super');
            this.spy(ParentClass.prototype, 'constructor');

            instance = new ChildClass();
        });

        it('can be newed up', function () {

            instance
                .should.be.instanceof(ChildClass);

        });

        it('can have prototype methods', function () {

            instance.aFn
                .should.be.a('function')
                .and.equal(ChildClass.prototype.aFn);

        });

        it('can have static properties', function () {

            ChildClass.staticFn
                .should.be.a('function');

            ChildClass.staticProp
                .should.be.a('boolean');

        });

        it('calls super with the instance when instantiated', function () {

            Class.super
                .should.have.been.calledWith(ChildClass);

        });

        it('calls the custom constructor method when instantiated', function () {

            Class.super(ChildClass).constructor
                .should.have.been.called;

        });

    });

    describe('.extends() with class and prototype arguments', function () {

        var ExtendableClass,
            ExtendedChild,
            instance;

        beforeEach(function () {

            ExtendableClass = Class('ExtendableClass', {
                aFn: function aFn() {}
            }, {
                staticFunc: function () {}
            });

            ExtendedChild = Class('ExtendedChild').extends(ExtendableClass, {
                bFn: function bFn() {}
            }, {
                childStaticFunc: function () {}
            });

            instance = new ExtendedChild();
        });

        it('returns a child class that can be newed up', function () {

            instance
                .should.be.an.instanceof(ExtendedChild);

        });

        it('returns an instance of the class argument', function () {

            instance
                .should.be.an.instanceof(ExtendableClass);

        });

        it('does not return an instance of Class', function () {

            instance
                .should.not.be.an.instanceof(Class);

        });

        it('extends its prototype from the class argument', function () {

            instance.aFn
                .should.be.a('function')
                .and.equal(ExtendableClass.prototype.aFn);

        });

        it('has its own prototype methods', function () {

            instance.bFn
                .should.be.a('function')
                .and.equal(ExtendedChild.prototype.bFn);

        });

        it('extends its static properties from the class argument', function () {

            ExtendedChild.staticFunc
                .should.be.a('function');

        });


        it('has its own static properties', function () {

            ExtendedChild.childStaticFunc
                .should.be.a('function');

        });

        it('creates a reference to the parents\' prototype via Class.super', function () {

            Class.super(ExtendedChild)
                .should.equal(ExtendableClass.prototype);

        });

        it('throws a TypeError if not called on a function or null', function () {

            (function () {
                Class('ExtendedChild').extends(undefined);
            }).should.throw(TypeError, 'Class extends value ' +
                '[object Undefined] is not a function or null');

            (function () {
                Class('ExtendedChild').extends({});
            }).should.throw(TypeError, 'Class extends value ' +
                '[object Object] is not a function or null');

            (function () {
                Class('ExtendedChild').extends([]);
            }).should.throw(TypeError, 'Class extends value ' +
                '[object Array] is not a function or null');

            (function () {
                Class('ExtendedChild').extends(2);
            }).should.throw(TypeError, 'Class extends value ' +
                '[object Number] is not a function or null');

            (function () {
                Class('ExtendedChild').extends('');
            }).should.throw(TypeError, 'Class extends value ' +
                '[object String] is not a function or null');

            (function () {
                Class('ExtendedChild').extends(instance);
            }).should.throw(TypeError, 'Class extends value ' +
                '[object Object] is not a function or null');

        });

    });

    describe('.extends() without a prototype argument', function () {

        var ExtendableClass,
            ExtendedChild,
            instance;

        beforeEach(function () {

            ExtendableClass = Class('ExtendableClass', {
                aFn: function aFn() {}
            }, {
                staticFunc: function () {}
            });

            ExtendedChild = Class('ExtendedChild').extends(ExtendableClass);

            instance = new ExtendedChild();
        });

        it('returns a child class that can be newed up', function () {

            ExtendedChild
                .should.be.a('function');

            instance
                .should.be.an.instanceof(ExtendedChild);

        });

        it('returns an instance of the class argument', function () {

            instance
                .should.be.an.instanceof(ExtendableClass);

        });

        it('does not return an instance of Class', function () {

            instance
                .should.not.be.an.instanceof(Class);

        });

        it('extends its prototype from the class argument', function () {

            instance.aFn
                .should.be.a('function')
                .and.equal(ExtendableClass.prototype.aFn);

        });

        it('extends its static properties from the class argument', function () {

            ExtendedChild.staticFunc
                .should.be.a('function');

        });

        it('creates a reference to the class arguments\'s prototype via Class.super', function () {

            Class.super(ExtendedChild)
                .should.equal(ExtendableClass.prototype);

        });

    });

    describe('.super()', function () {

        var ExtendableClass,
            ExtendedChild,
            ExtendedExtendedChild;

        beforeEach(function () {

            ExtendableClass = Class('ExtendableClass', {
                aFn: function aFn() {}
            }, {
                staticFunc: function () {}
            });

            ExtendedChild = Class('ExtendedChild').extends(ExtendableClass, {
                bFn: function bFn() {}
            }, {
                childStaticFunc: function () {}
            });

            ExtendedExtendedChild = Class('ExtendedExtendedChild').extends(ExtendedChild, {
                cFn: function cFn() {}
            }, {
                childStaticFunc: function () {}
            });

        });

        it('must be called with an Class constructor', function () {

            Class.super(ExtendedChild).constructor
                .should.equal(ExtendableClass);

            Class.super(ExtendedExtendedChild).constructor
                .should.equal(ExtendedChild);

        });

        it('cannot be called with a Class instance', function () {

            (function () {
                Class.super(new ExtendedChild);
            }).should.throw(TypeError, 'Class.super must be called with a constructor');

        });

        it('can be called multiple times down the chain', function () {
            var instance = new ExtendedExtendedChild();
            instance.should.be.instanceof(ExtendableClass);
        });

    });

});




















