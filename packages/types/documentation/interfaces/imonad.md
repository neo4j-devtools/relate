[@relate/types](../README.md) › [IMonad](imonad.md)

# Interface: IMonad ‹**T**›

## Type parameters

▪ **T**

## Hierarchy

* Iterable‹T›

  ↳ **IMonad**

## Implemented by

* [Bool](../classes/bool.md)
* [Dict](../classes/dict.md)
* [List](../classes/list.md)
* [Maybe](../classes/maybe.md)
* [Monad](../classes/monad.md)
* [Nil](../classes/nil.md)
* [None](../classes/none.md)
* [Num](../classes/num.md)
* [Str](../classes/str.md)

## Index

### Properties

* [isEmpty](imonad.md#isempty)

### Methods

* [[Symbol.iterator]](imonad.md#[symbol.iterator])
* [equals](imonad.md#equals)
* [flatMap](imonad.md#flatmap)
* [get](imonad.md#get)
* [getOrElse](imonad.md#getorelse)
* [isThis](imonad.md#isthis)
* [map](imonad.md#map)
* [switchMap](imonad.md#switchmap)
* [tap](imonad.md#tap)
* [toString](imonad.md#tostring)

## Properties

###  isEmpty

• **isEmpty**: *boolean*

*Defined in [src/monads/monad.ts:4](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L4)*

## Methods

###  [Symbol.iterator]

▸ **[Symbol.iterator]**(): *Iterator‹T›*

*Inherited from [IMonad](imonad.md).[[Symbol.iterator]](imonad.md#[symbol.iterator])*

Defined in node_modules/typescript/lib/lib.es2015.iterable.d.ts:51

**Returns:** *Iterator‹T›*

___

###  equals

▸ **equals**(`other`: [IMonad](imonad.md)‹any›): *boolean*

*Defined in [src/monads/monad.ts:8](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | [IMonad](imonad.md)‹any› |

**Returns:** *boolean*

___

###  flatMap

▸ **flatMap**‹**M**›(`project`: function): *M*

*Defined in [src/monads/monad.ts:20](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L20)*

**Type parameters:**

▪ **M**

**Parameters:**

▪ **project**: *function*

▸ (`value`: T): *M*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *M*

___

###  get

▸ **get**(): *T | undefined*

*Defined in [src/monads/monad.ts:10](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L10)*

**Returns:** *T | undefined*

___

###  getOrElse

▸ **getOrElse**(`other`: T): *T*

*Defined in [src/monads/monad.ts:12](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | T |

**Returns:** *T*

___

###  isThis

▸ **isThis**(`other?`: any): *other is this*

*Defined in [src/monads/monad.ts:6](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L6)*

**Parameters:**

Name | Type |
------ | ------ |
`other?` | any |

**Returns:** *other is this*

___

###  map

▸ **map**(`project`: function): *[IMonad](imonad.md)‹T›*

*Defined in [src/monads/monad.ts:16](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L16)*

**Parameters:**

▪ **project**: *function*

▸ (`value`: T): *T*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *[IMonad](imonad.md)‹T›*

___

###  switchMap

▸ **switchMap**‹**M**›(`project`: function): *M*

*Defined in [src/monads/monad.ts:22](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L22)*

**Type parameters:**

▪ **M**

**Parameters:**

▪ **project**: *function*

▸ (`value`: this): *M*

**Parameters:**

Name | Type |
------ | ------ |
`value` | this |

**Returns:** *M*

___

###  tap

▸ **tap**(`project`: function): *this*

*Defined in [src/monads/monad.ts:18](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L18)*

**Parameters:**

▪ **project**: *function*

▸ (`value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *this*

___

###  toString

▸ **toString**(`formatter?`: undefined | function): *string*

*Defined in [src/monads/monad.ts:14](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`formatter?` | undefined &#124; function |

**Returns:** *string*
