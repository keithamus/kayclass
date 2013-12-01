'use strict';
describe('Class', function () {

    var Class = typeof require === 'undefined' ? window.KClass : require('../index.js'),
        instance, Extended, fn;

    it('can be newed up', function () {

        instance = new Class();

        instance
            .should.be.instanceof(Class);

    });

    describe('extended child', function () {

        beforeEach(function () {
            Extended = Class.extend({
                aProperty: true,
                aFn: function () {}
            }, {
                staticProp: true
            });
            instance = new Extended();
        });

        it('is instance is instanceof Extended', function () {

            instance
                .should.be.instanceof(Extended);

        });

        it('is instance is instanceof Class', function () {

            instance
                .should.be.instanceof(Class);

        });

        it('has a reference to Class via .super', function () {

            Extended.super
                .should.equal(Class);

        });

        it('inherits prototype properties', function () {

            instance.on
                .should.be.a('function')
                .and.equal(Class.prototype.on);

            instance.once
                .should.be.a('function')
                .and.equal(Class.prototype.once);

            instance.off
                .should.be.a('function')
                .and.equal(Class.prototype.off);

            instance.emit
                .should.be.a('function')
                .and.equal(Class.prototype.emit);

        });

        it('has its own prototype properties', function () {

            Extended.prototype.aProperty
                .should.equal(true);

            Extended.prototype.aFn
                .should.be.a('function');

        });

        it('has static properties inherited from Class', function () {

            Extended.extend
                .should.equal(Class.extend);

        });

        it('has its own static properties', function () {

            Extended.staticProp
                .should.equal(true);

        });

        it('can override Class prototype properties (e.g `on`)', function () {
            var onFn = function () {},
                onceFn = function () {},
                offFn = function () {},
                emitFn = function () {};

            Extended = Class.extend({
                on: onFn,
                once: onceFn,
                off: offFn,
                emit: emitFn,
            });

            Extended.prototype.on
                .should.equal(onFn);

            (new Extended()).on
                .should.equal(onFn);

            Extended.prototype.once
                .should.equal(onceFn);

            (new Extended()).once
                .should.equal(onceFn);

            Extended.prototype.off
                .should.equal(offFn);

            (new Extended()).off
                .should.equal(offFn);

            Extended.prototype.emit
                .should.equal(emitFn);

            (new Extended()).emit
                .should.equal(emitFn);


        });

        it('can override Class static properties (e.g `extend`)', function () {
            var extendFn = function () {};

            Extended = Class.extend({}, { extend: extendFn });

            Extended.extend
                .should.equal(extendFn);

        });

        it('does not copy over read-only properties', function () {

            Extended = Class.extend({ name: 'a', length: 4 });

            Extended.name
                .should.equal('subClass');

            Extended.length
                .should.equal(0);

        });

        describe('a child inheriting from child (multiple inheritence)', function () {
            var ExtendedChild;

            beforeEach(function () {
                ExtendedChild = Extended.extend({
                    aProperty: false,
                    aFn: function () {}
                });
                instance = new ExtendedChild();
            });

            it('is instance is instanceof ExtendedChild', function () {

                instance
                    .should.be.instanceof(ExtendedChild);

            });

            it('is instance is instanceof Extended', function () {

                instance
                    .should.be.instanceof(Extended);

            });

            it('is instance is instanceof Class', function () {

                instance
                    .should.be.instanceof(Class);

            });

            it('has a reference to Extended via .super', function () {

                ExtendedChild.super
                    .should.equal(Extended);

            });

            it('has a reference to Class via .super', function () {

                ExtendedChild.super.super
                    .should.equal(Class);

            });

            it('inherits prototype properties', function () {

                ExtendedChild = Extended.extend();
                instance = new ExtendedChild();

                instance.on
                    .should.be.a('function')
                    .and.equal(Class.prototype.on);

                instance.once
                    .should.be.a('function')
                    .and.equal(Class.prototype.once);

                instance.off
                    .should.be.a('function')
                    .and.equal(Class.prototype.off);

                instance.emit
                    .should.be.a('function')
                    .and.equal(Class.prototype.emit);

                instance.aFn
                    .should.be.a('function')
                    .and.equal(Extended.prototype.aFn);

                instance.aProperty
                    .should.equal(true);

            });

            it('has its own prototype properties, overriding parent', function () {

                ExtendedChild.prototype.aProperty
                    .should.equal(false);

                ExtendedChild.prototype.aFn
                    .should.be.a('function');

                ExtendedChild.prototype.aFn
                    .should.not.equal(Extended.prototype.aFn);

            });

            it('has static properties inherited from Class', function () {

                ExtendedChild.extend
                    .should.equal(Class.extend);

            });

            it('has static properties inherited from Extended', function () {

                ExtendedChild.staticProp
                    .should.equal(true);

            });

            it('has its own static properties', function () {

                ExtendedChild.staticProp
                    .should.equal(true);

            });

            it('can override Class prototype properties (e.g `on`)', function () {
                var onFn = function () {},
                    onceFn = function () {},
                    offFn = function () {},
                    emitFn = function () {},
                    aFn = function () {};

                ExtendedChild = Extended.extend({
                    on: onFn,
                    once: onceFn,
                    off: offFn,
                    emit: emitFn,
                    aFn: aFn
                });

                ExtendedChild.prototype.on
                    .should.equal(onFn);

                (new ExtendedChild()).on
                    .should.equal(onFn);

                ExtendedChild.prototype.once
                    .should.equal(onceFn);

                (new ExtendedChild()).once
                    .should.equal(onceFn);

                ExtendedChild.prototype.off
                    .should.equal(offFn);

                (new ExtendedChild()).off
                    .should.equal(offFn);

                ExtendedChild.prototype.emit
                    .should.equal(emitFn);

                (new ExtendedChild()).emit
                    .should.equal(emitFn);

                ExtendedChild.prototype.aFn
                    .should.equal(aFn);

                (new ExtendedChild()).aFn
                    .should.equal(aFn);


            });

            it('can override Class static properties (e.g `extend`)', function () {
                var extendFn = function () {};

                ExtendedChild = Extended.extend({}, { extend: extendFn });

                ExtendedChild.extend
                    .should.equal(extendFn);

            });

            it('can be extended in the same way', function () {

                var C = ExtendedChild.extend({});
                instance = new C();

                instance
                    .should.be.instanceof(C);

                C.extend
                    .should.equal(Class.extend);

                instance.on
                    .should.equal(Class.prototype.on);

                instance.aFn
                    .should.equal(ExtendedChild.prototype.aFn);

            });


        });

    });

    describe('events', function () {

        var listener, context;

        beforeEach(function () {
            instance = new Class();
            listener = this.spy();
            context = {};
        });

        describe('.on', function () {

            it('is given an event name, and a listener', function () {

                instance.on('eventname', listener)
                    .should.equal(instance);

                listener
                    .should.have.not.been.called;

            });

            it('will fire the listener multiple times', function () {

                instance.on('eventname', listener)
                    .should.equal(instance);

                listener
                    .should.have.not.been.called;

                instance.emit('eventname')
                    .should.equal(true);

                listener
                    .should.have.been.calledOnce;

                instance.emit('eventname')
                    .should.equal(true);

                listener
                    .should.have.been.calledTwice;

                instance.emit('eventname')
                    .should.equal(true);

                listener
                    .should.have.been.calledThrice;

            });

        });

        describe('.emit', function () {

            it('is given an eventname, where it will fire all attached events', function () {

                instance
                    .on('eventname', listener)
                    .emit('eventname')
                        .should.equal(true);

                listener
                    .should.have.been.calledOnce;

            });

            it('will fire all event listeners on that event', function () {

                var anotherListener = this.spy();

                instance
                    .on('eventname', listener)
                    .on('eventname', anotherListener)
                    .emit('eventname')
                        .should.equal(true);

                listener
                    .should.have.been.calledOnce;

                anotherListener
                    .should.have.been.calledOnce;

            });

            it('will send any arguments provided to the event listeners', function () {

                var anotherListener = this.spy();

                instance
                    .on('eventname', listener)
                    .on('eventname', anotherListener)
                    .emit('eventname', 1, 2, 3, context)
                        .should.equal(true);

                listener
                    .should.have.been.calledOnce
                    .and.always.have.been.calledWithExactly(1, 2, 3, context);

                anotherListener
                    .should.have.been.calledOnce
                    .and.always.have.been.calledWithExactly(1, 2, 3, context);

            });

            it('throws Error on "error" event emitted, with no listeners', function () {

                (fn = function () { instance.emit('error', new Error('Hi!')); })
                    .should.throw('Hi!');

            });

        });

        describe('.off', function () {

            it('is given an event name, and a listener', function () {

                instance.off('eventname', listener)
                    .should.equal(instance);

                listener
                    .should.have.not.been.called;

            });

            it('will remove a bound (.on\'d) event listener from the event name', function () {

                instance
                    .on('eventname', listener)
                    .emit('eventname')
                        .should.equal(true);

                listener
                    .should.have.been.calledOnce;

                instance
                    .off('eventname', listener)
                    .emit('eventname')
                        .should.equal(false);

                listener
                    .should.have.been.calledOnce;

                instance.emit('eventname')
                    .should.equal(false);

                listener
                    .should.have.been.calledOnce;

            });

            it('will remove all listeners on an event if only given a name', function () {

                var anotherListener = this.spy();

                instance
                    .on('eventname', listener, context)
                    .on('eventname', anotherListener)
                    .emit('eventname')
                        .should.equal(true);

                listener
                    .should.have.been.calledOnce;

                anotherListener
                    .should.have.been.calledOnce;

                instance
                    .off('eventname')
                    .emit('eventname');

                listener
                    .should.have.been.calledOnce;

                anotherListener
                    .should.have.been.calledOnce;

                instance
                    .emit('eventname');

                listener
                    .should.have.been.calledOnce;

                anotherListener
                    .should.have.been.calledOnce;

            });

        });

        describe('.once', function () {

            it('is given an event name, and a listener', function () {

                instance.once('eventname', listener)
                    .should.equal(instance);

                listener
                    .should.have.not.been.called;

            });

            it('will fire the listener only once, and then will detatch itself', function () {

                instance.once('eventname', listener)
                    .should.equal(instance);

                listener
                    .should.have.not.been.called;

                instance.emit('eventname')
                    .should.equal(true);

                listener
                    .should.have.been.calledOnce;

                instance.emit('eventname')
                    .should.equal(false);

                listener
                    .should.have.been.calledOnce;

                instance.emit('eventname')
                    .should.equal(false);

                listener
                    .should.have.been.calledOnce;

            });


        });


    });

});
