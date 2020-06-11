[@relate/types](../README.md) › [Bool](bool.md)

# Class: Bool

**`description`** 
Represents a Boolean value

If you just want to access the plain JS value, use `.get()`:
```ts
const bool: Bool = Bool.from(true);
const plain: boolean = bool.get();
```

## Hierarchy

* [Monad](monad.md)‹boolean›

  ↳ **Bool**

## Implements

* [IMonad](../interfaces/imonad.md)‹boolean›

## Index

### Properties

* [FALSE](bool.md#static-false)
* [TRUE](bool.md#static-true)

### Accessors

* [isEmpty](bool.md#isempty)

### Methods

* [from](bool.md#static-from)
* [isBool](bool.md#static-isbool)
* [of](bool.md#static-of)

## Properties

### `Static` FALSE

▪ **FALSE**: *[Bool](bool.md)‹›* = new Bool(false)

*Defined in [src/monads/primitive/bool.monad.ts:18](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L18)*

___

### `Static` TRUE

▪ **TRUE**: *[Bool](bool.md)‹›* = new Bool(true)

*Defined in [src/monads/primitive/bool.monad.ts:16](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L16)*

## Accessors

###  isEmpty

• **get isEmpty**(): *false*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

*Defined in [src/monads/primitive/bool.monad.ts:30](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L30)*

Bool is never empty

**Returns:** *false*

## Methods

### `Static` from

▸ **from**(`val`: any): *[Bool](bool.md)*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

*Defined in [src/monads/primitive/bool.monad.ts:76](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L76)*

Coerces anything into a Bool

**`see`** [Bool.of](bool.md#static-of)

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Bool](bool.md)*

___

### `Static` isBool

▸ **isBool**(`val`: any): *val is Bool*

*Defined in [src/monads/primitive/bool.monad.ts:42](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L42)*

Indicates if passed value is an instance of `Bool`
```ts
if (Bool.isBool(val)) {
    // is a Bool
}
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Bool*

___

### `Static` of

▸ **of**(`val`: any): *[Bool](bool.md)*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

*Defined in [src/monads/primitive/bool.monad.ts:66](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/bool.monad.ts#L66)*

Returns a Bool representing if passed value is "empty".

```ts
const strBool: Bool<true> = Bool.of('foo');
const strBool: Bool<false> = Bool.of('');

const strMonad: Monad<'foo'> = Monad.from('foo');
const strBool: Bool<true> = Bool.of(strMonad);

const strMonad: Monad<''> = Monad.from('');
const strBool: Bool<false> = Bool.of(strMonad);

const listMonad: List<string> = List.from(['']);
const listBool: Bool<true> = Bool.of(listMonad);

const listMonad: List<string> = List.from([]);
const listBool: Bool<false> = Bool.of(listMonad);
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Bool](bool.md)*
