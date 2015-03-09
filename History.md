## v2.1.1

### Changes

 - [#30](https://github.com/kay-framework/kayclass/pull/30):
   Fix bug where the default constructor would not return the Class.super call
   (Fix [#29](https://github.com/kay-framework/kayclass/issues/29))
   ([@keithamus](https://github.com/keithamus))

## v2.1.0

### Changes

 - [#18](https://github.com/kay-framework/kayclass/pull/18):
   Build a browserify version for Browsers.
   (Fix [#11](https://github.com/kay-framework/kayclass/issues/11))
   ([@keithamus](https://github.com/keithamus))
 - [#22](https://github.com/kay-framework/kayclass/pull/22):
   Fix bug where static functions could not override inherited ones, and where
   non-functions were allowed for statics.
   (Fix [#21](https://github.com/kay-framework/kayclass/issues/21))
   ([@keithamus](https://github.com/keithamus))

### Tooling Changes

 - [#16](https://github.com/kay-framework/kayclass/pull/16):
   Add istanbul/coveralls code coverage
   (Fix [#10](https://github.com/kay-framework/kayclass/issues/10))
   ([@keithamus](https://github.com/keithamus))
 - [#17](https://github.com/kay-framework/kayclass/pull/17):
   Add SauceLabs browser testing integration
   (Fix [#15](https://github.com/kay-framework/kayclass/issues/15))
   ([@keithamus](https://github.com/keithamus))
 - [#20](https://github.com/kay-framework/kayclass/pull/20):
   Add travis-ci integration
   (Fix [#19](https://github.com/kay-framework/kayclass/issues/19))
   ([@keithamus](https://github.com/keithamus))

## v2.0.0

### Breaking Changes

 - `Class.super(this)` is no longer allowed, `Class.super` must be called with a
   Class constructor, not instance (`Class.super(MyClass)`).

### Changes

 - [#13](https://github.com/kay-framework/kayclass/pull/12):
   Fixes an issue where inheriting 2 levels deep could cause stack overflows.
   (Fix [#12](https://github.com/kay-framework/kayclass/issues/12))
   ([@keithamus](https://github.com/keithamus))

## v1.0.0

### Breaking Changes

 - The class pattern has completely changed. Refer to the README.md, as well as
   [RFC003](https://git.io/kayrfc-0003) for how to use the new design.

### Changes

 - [#9](https://github.com/kay-framework/kayclass/issues/9):
   Implement new class design as per
   [RFC003](https://git.io/kayrfc-0003)
   (Fix [#7](https://github.com/kay-framework/kayclass/issues/7),
   RFC PR: [kay-framework/rfcs#7](https://git.io/xA2N)).
   ([@joechapman](https://github.com/joechapman))

## v0.1.0

Initial Release
