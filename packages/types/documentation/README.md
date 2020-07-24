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

Ƭ **KeyVal**: *T extends Map<infer K, infer V> ? object : T extends List<[infer K, infer V]> ? object : T extends List<Iterable<infer I>> ? object : T extends Array<Array<infer I>> ? object : object*

*Defined in [src/monads/primitive/dict.monad.ts:11](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L11)*

___

###  RawDict

Ƭ **RawDict**: *Map‹K, V›*

*Defined in [src/monads/primitive/dict.monad.ts:8](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L8)*
