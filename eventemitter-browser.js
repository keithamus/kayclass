(function (global) {
    'use strict';

    function isObject(o) {
        return typeof o === 'object' && o !== null;
    }

    function checkCallback(callback) {
        if (typeof callback !== 'function') {
            throw new TypeError('listener must be a function');
        }
    }

    function EventEmitter() {
        this._events = this._events || {};
        this._maxListeners = this._maxListeners || undefined;
    }

    EventEmitter.defaultMaxListeners = 10;


    /*
     * EventEmitter.listenerCount
     *
     * Public: Retreive the amount of currently listening callbacks on `emitter`
     *
     * emitter - An EventEmitter Instance Object
     * name    - The name of the event to count the listeners for
     *
     * Examples
     *
     *     EventEmitter.listenerCount(ee, 'foo'); // => 3
     *
     * Returns the Number of the listening callbacks on `name`.
     */
    EventEmitter.listenerCount = function listenerCount(emitter, type) {
        if (!emitter._events || !emitter._events[type]) {
            return 0;
        } else if (typeof emitter._events[type] === 'function') {
            return 1;
        } else {
            return emitter._events[type].length;
        }
    };

    EventEmitter.prototype = {
        constructor: EventEmitter,

        // This function has no effect on the browser version, but is here for
        // api stability.
        setMaxListeners: function setMaxListeners(n) {
            if (typeof n !== 'number' || n < 0 || isNaN(n)) {
                throw new TypeError('n must be a positive number');
            }
            this._maxListeners = n;
            return this;
        },

        /*
         * EventEmitter#addListener
         *
         * Public: Adds the `callback` to a list of listeners, that will get
         *         fired when `emit(name)` is called.
         *
         * name     - A String name to listen on.
         * callback - An Function to fire when the `name` event has been emitted.
         *
         * Examples
         *
         *     ee.addListener('foo', function () { console.log('hello!') });
         *     ee.emit('foo'); // "hello!" logged
         *
         * Returns this.
         * Raises TypeError::'listener must be a function' - The supplied
         *        `callback` was not a function.
         */
        addListener: function addListener(name, callback) {
            checkCallback(callback);
            if (!this._events) {
                this._events = {};
            }
            // To avoid recursion in the case that name === "newcallback"
            // Before adding it to the callbacks, first emit "newcallback".
            if (this._events.newcallback) {
                this.emit('newcallback', name,
                    typeof callback.callback === 'function' ?
                    callback.callback : callback
                );
            }
            if (!this._events[name]) {
                // Optimize the case of one callback, set it to a function,
                // rather than an Array of 1
                this._events[name] = callback;
            } else if (isObject(this._events[name])) {
                // If we've already got an array, just append.
                this._events[name].push(callback);
            } else {
                // Adding the second element, need to change to array.
                this._events[name] = [this._events[name], callback];
            }
            return this;
        },

        /*
         * EventEmitter#on
         *
         * Public: Adds the `callback` to a list of listeners, that will get
         *         fired when `emit(name)` is called.
         *
         * name     - A String name to listen on.
         * callback - An Function to fire when the `name` event has been emitted.
         *
         * Examples
         *
         *     ee.on('foo', function () { console.log('hello!') });
         *     ee.emit('foo'); // "hello!" logged
         *
         * Returns this.
         * Raises TypeError::'listener must be a function' - The supplied
         *        `callback` was not a function.
         */
        on: function on(name, callback) {
            return this.addListener(name, callback);
        },

        /*
         * EventEmitter#once
         *
         * Public: Adds the `callback` to a list of listeners, that will get
         *         fired only the first time `emit(name)` is called.
         *
         * name     - A String name to listen on.
         * callback - An Function to fire when the `name` event has been emitted.
         *
         * Examples
         *
         *     ee.once('foo', function () { console.log('hello!') });
         *     ee.emit('foo'); // "hello!" logged
         *     ee.emit('foo'); // callback is not called again...
         *
         * Returns this.
         * Raises TypeError::'listener must be a function' - The supplied
         *        `callback` was not a function.
         */
        once: function once(name, callback) {
            checkCallback(callback);
            // Create a function which removes itself from the listener list as
            // soon as it is fired, then calls the underlying callback.
            var fired = false,
                onceCallback = function onceCallback() {
                    this.removeListener(name, onceCallback);
                    if (!fired) {
                        fired = true;
                        callback.apply(this, arguments);
                    }
                };
            onceCallback.listener = callback;
            return this.addListener(name, onceCallback);
        },

        /*
         * EventEmitter#removeListener
         *
         * Public: Removes the `callback` from the list of listeners, to stop it
         *         from being fired again after an `emit(name)`.
         *
         * name     - A String name to listen on.
         * callback - An Function to fire when the `name` event has been emitted.
         *
         * Examples
         *
         *     ee.removeListener('foo', function () { console.log('hello!') });
         *     ee.emit('foo'); // callback is never called...
         *
         * Returns this.
         * Raises TypeError::'listener must be a function' - The supplied
         *        `callback` was not a function.
         */
        removeListener: function removeListener(name, callback) {
            checkCallback(callback);
            if (!this._events || !this._events[name]) {
                return this;
            }
            var callbacks = this._events[name],
                length = callbacks.length,
                position = -1,
                i;
            // Handle a fast case of one listener, being the single `callback`
            // function, which saves iterating through an Array of 1
            if (callbacks === callback || callbacks.listener === callback) {
                delete this._events[name];
                // Fire the removeListener event about the callback
                if (this._events.removeListener) {
                    this.emit('removeListener', name, callback);
                }
            // Iterate through the Array of callbacks (if more than one callback
            // has been registered)
            } else if (isObject(callbacks)) {
                // Find the index of the callback:
                for (i = length; i > 0; i--) {
                    if (callbacks[i] === callback || callbacks[i].listener === callback) {
                        position = i;
                        break;
                    }
                }
                // Return early if the callback was not found
                if (position < 0) {
                    return this;
                }
                callbacks.splice(position, 1);
                // Re-optimize for if one callback is all that is remaining,
                // setting this._events[name] back to a plain function rather
                // than Array
                if (callbacks.length === 1) {
                    this._events[name] = callbacks[0];
                }
                if (this._events.removeListener) {
                    this.emit('removeListener', name, callback);
                }
            }
            return this;
        },

        removeAllListeners: function removeAllListeners(name) {
            var key, callbacks;
            if (!this._events) {
                return this;
            }
            // If nothing is listening to removeListener, this can be done
            // really simply by just deleting the events stack:
            if (!this._events.removeListener) {
                if (arguments.length === 0){
                    this._events = {};
                } else if (this._events[name]) {
                    delete this._events[name];
                }
                return this;
            // RemoveListener exists, but all listeners have been requested to
            // be removed, so send the removeListener event for each one.
            } else if (arguments.length === 0) {
                for (key in this._events) {
                    // To stop recursion & other problems, save the
                    // removeListener from removal event until last
                    if (key === 'removeListener') {
                        continue;
                    }
                    this.removeAllListeners(key);
                }
                this.removeAllListeners('removeListener');
                this._events = {};
                return this;
            }
            // RemoveListener exists, and an eventname has been specified
            callbacks = this._events[name];
            if (util.isFunction(callbacks)) {
                this.removeListener(name, callbacks);
            } else if (Array.isArray(callbacks)) {
                // LIFO order
                while (callbacks.length) {
                    this.removeListener(name, callbacks[callbacks.length - 1]);
                }
            }
            delete this._events[name];
            return this;
        },

        /*
         * EventEmitter#emit
         *
         * Public: Fires an event of `name` which fires all the callbacks
         *         listening to that event.
         *
         * name - A String name to fire.
         * args - Zero or more arguments to pass to all callbacks listening to
         *        the event of `name`.
         *
         * Examples
         *
         *     ee.emit('foo', function () { console.log('hello!') });
         *     ee.emit('foo'); // "hello!" logged
         *
         * Returns this.
         * Raises TypeError::'listener must be a function' - The supplied
         *        `callback` was not a function.
         */
        emit: function emit(name) {
            var error, callback, i;
            // As a special case for error events, when no listeners are bound to an error event,
            // then throw the first argument (which *should* be an Error object).
            if (name === 'error' && !this._events.error) {
                error = arguments[1];
                if (error instanceof Error) {
                    throw error; // Unhandled 'error' event
                } else {
                    throw new Error('Uncaught, unspecified "error" event.');
                }
            }
            callback = this._events[name];
            // Return early if events object, is empty or has no events bound to
            // `name`.
            if (callback === undefined) {
                return false;
            }
            // Handle a fast case of one listener, being the single `callback`
            // function, which saves iterating through an array of 1
            if (typeof callback === 'function') {
                // Optimise emitting of events for majority usecases where the
                // argument lists are 3 or less arguments. This works because
                // `<Function>.call()` is faster than `<Function>.apply()`.
                switch (arguments.length) {
                case 1:
                    callback.call(this);
                    break;
                case 2:
                    callback.call(this, arguments[1]);
                    break;
                case 3:
                    callback.call(this, arguments[1], arguments[2]);
                    break;
                case 4:
                    callback.call(this, arguments[1], arguments[2], arguments[3]);
                    break;
                default:
                    callback.apply(this, [].slice.call(arguments, 1));
                }
                return true;
            // Iterate through the Array of callbacks (if more than one callback
            // has been registered)
            } else if (isObject(callback)) {
                for (i = 0; i < callback.length; i++) {
                    // Optimise emitting of events for majority usecases where the
                    // argument lists are 3 or less arguments. This works because
                    // `<Function>.call()` is faster than `<Function>.apply()`.
                    switch (arguments.length) {
                    case 1:
                        callback[i].call(this);
                        break;
                    case 2:
                        callback[i].call(this, arguments[1]);
                        break;
                    case 3:
                        callback[i].call(this, arguments[1], arguments[2]);
                        break;
                    case 4:
                        callback[i].call(this, arguments[1], arguments[2], arguments[3]);
                        break;
                    default:
                        callback[i].apply(this, [].slice.call(arguments, 1));
                    }
                }
                return true;
            }
            return false;
        }
    };

    // Export out EventEmitter into a module.exports module (for Node)
    // or a property on the window object (for Browsers)
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EventEmitter;
    } else {
        (typeof window !== 'undefined' ? window : global).EventEmitter = EventEmitter;
    }

})(typeof window !== 'undefined' ? window : global);
