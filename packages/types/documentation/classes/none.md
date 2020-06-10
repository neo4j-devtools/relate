[@relate/types](../README.md) › [None](none.md)

# Class: None ‹**T**›

**`description`** 
Represents an undefined value

If you just want to access the plain JS value, use `.get()`:
```ts
const none: None = None.from();
const plain: undefined = none.get();
```

## Type parameters

▪ **T**: *any*

## Hierarchy

* [Monad](monad.md)‹T›

  ↳ **None**

## Implements

* [IMonad](../interfaces/imonad.md)‹T›

## Index

### Properties

* [EMPTY](none.md#static-empty)

### Accessors

* [isEmpty](none.md#isempty)

### Methods

* [toJSON](none.md#tojson)
* [toString](none.md#tostring)
* [from](none.md#static-from)
* [isNone](none.md#static-isnone)
* [of](none.md#static-of)

## Properties

### `Static` EMPTY

▪ **EMPTY**: *[None](none.md)‹any›* = new None()

*Defined in [src/monads/primitive/none.monad.ts:15](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L15)*

## Accessors

###  isEmpty

• **get isEmpty**(): *true*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

*Defined in [src/monads/primitive/none.monad.ts:28](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L28)*

None is always empty

**Returns:** *true*

## Methods

###  toJSON

▸ **toJSON**(): *undefined*

*Overrides [Monad](monad.md).[toJSON](monad.md#tojson)*

*Defined in [src/monads/primitive/none.monad.ts:73](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L73)*

None cannot be stringified

**Returns:** *undefined*

___

###  toString

▸ **toString**(): *string*

*Overrides [Monad](monad.md).[toString](monad.md#tostring)*

*Defined in [src/monads/primitive/none.monad.ts:66](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L66)*

**Returns:** *string*

___

### `Static` from

▸ **from**‹**T**›(`_?`: any): *[None](none.md)‹T›*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

*Defined in [src/monads/primitive/none.monad.ts:62](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L62)*

**`see`** [None.of](none.md#static-of)

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`_?` | any |

**Returns:** *[None](none.md)‹T›*

___

### `Static` isNone

▸ **isNone**‹**T**›(`val`: any): *val is None<T>*

*Defined in [src/monads/primitive/none.monad.ts:40](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L40)*

Indicates if passed value is an instance of `None`
```ts
if (None.isNone(val)) {
    // is a None
}
```

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is None<T>*

___

### `Static` of

▸ **of**‹**T**›(`_?`: any): *[None](none.md)‹T›*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

*Defined in [src/monads/primitive/none.monad.ts:55](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/none.monad.ts#L55)*

Returns a None, regardless of value.

```ts
const strNone: None<string> = None.of('foo');
const addNone: None<never[]> = None.of([]);

const listMonad: List<string> = List.from(['']);
const listNone: None<List<string>> = None.of(listMonad);
```

**Type parameters:**

▪ **T**: *any*

**Parameters:**

Name | Type |
------ | ------ |
`_?` | any |

**Returns:** *[None](none.md)‹T›*
