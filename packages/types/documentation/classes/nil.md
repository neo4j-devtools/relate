[@relate/types](../README.md) › [Nil](nil.md)

# Class: Nil

**`description`** 
Represents an null value

If you just want to access the plain JS value, use `.get()`:
```ts
const nil: Nil = Nil.from();
const plain: null = nil.get();
```

## Hierarchy

* [Monad](monad.md)‹null›

  ↳ **Nil**

## Implements

* [IMonad](../interfaces/imonad.md)‹null›

## Index

### Properties

* [NULL](nil.md#static-null)

### Accessors

* [isEmpty](nil.md#isempty)

### Methods

* [from](nil.md#static-from)
* [isNil](nil.md#static-isnil)
* [of](nil.md#static-of)

## Properties

### `Static` NULL

▪ **NULL**: *[Nil](nil.md)‹›* = new Nil()

Defined in src/monads/primitive/nil.monad.ts:15

## Accessors

###  isEmpty

• **get isEmpty**(): *true*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

Defined in src/monads/primitive/nil.monad.ts:27

Nil is always empty

**Returns:** *true*

## Methods

### `Static` from

▸ **from**(`_?`: any): *[Nil](nil.md)*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

Defined in src/monads/primitive/nil.monad.ts:61

**`see`** [Nil.of](nil.md#static-of)

**Parameters:**

Name | Type |
------ | ------ |
`_?` | any |

**Returns:** *[Nil](nil.md)*

___

### `Static` isNil

▸ **isNil**(`val`: any): *val is Nil*

Defined in src/monads/primitive/nil.monad.ts:39

Indicates if passed value is an instance of `Nil`
```ts
if (Nil.isNil(val)) {
    // is a Nil
}
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Nil*

___

### `Static` of

▸ **of**(`_?`: any): *[Nil](nil.md)*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

Defined in src/monads/primitive/nil.monad.ts:54

Returns a Nil, regardless of value.

```ts
const strNil: Nil = Nil.of('foo');
const addNil: Nil = Nil.of([]);

const listMonad: List<string> = List.from(['']);
const listNil: Nil = Nil.of(listMonad);
```

**Parameters:**

Name | Type |
------ | ------ |
`_?` | any |

**Returns:** *[Nil](nil.md)*
