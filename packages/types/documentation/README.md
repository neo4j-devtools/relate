[@relate/types](README.md)

# @relate/types

## Index

### Classes

* [Bool](classes/bool.md)
* [Dict](classes/dict.md)
* [List](classes/list.md)
* [Maybe](classes/maybe.md)
* [Monad](classes/monad.md)
* [Nil](classes/nil.md)
* [None](classes/none.md)
* [Num](classes/num.md)
* [Str](classes/str.md)

### Interfaces

* [IAsObject](interfaces/iasobject.md)
* [IMonad](interfaces/imonad.md)

### Type aliases

* [KeyVal](README.md#keyval)
* [RawDict](README.md#rawdict)

## Type aliases

###  KeyVal

Ƭ **KeyVal**: *T extends Map<infer K, infer V> ? object : T extends List<[]> ? object : T extends List<Iterable<infer I>> ? object : T extends Array<Array<infer I>> ? object : object*

Defined in packages/types/src/monads/primitive/dict.monad.ts:11

___

###  RawDict

Ƭ **RawDict**: *Map‹K, V›*

Defined in packages/types/src/monads/primitive/dict.monad.ts:8
