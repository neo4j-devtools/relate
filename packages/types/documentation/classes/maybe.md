[@relate/types](../README.md) › [Maybe](maybe.md)

# Class: Maybe ‹**T**›

**`description`** 
Represents a potentially "empty" value (if value is null | undefined | Nil | None)
```ts
Maybe.of('').isEmpty // false
Maybe.of(Bool.FALSE).isEmpty // false
Maybe.of(false).isEmpty // false
Maybe.of(null).isEmpty // true
Maybe.of(Nil).isEmpty // true
Maybe.of(None).isEmpty // true
Maybe.of(List.from()).isEmpty // false
Maybe.of(List.from([1)).isEmpty // false
```

## Type parameters

▪ **T**

## Hierarchy

* [Monad](monad.md)‹T | [None](none.md)‹T››

  ↳ **Maybe**

## Implements

* [IMonad](../interfaces/imonad.md)‹T | [None](none.md)‹T››

## Index

### Properties

* [EMPTY](maybe.md#static-empty)

### Accessors

* [isEmpty](maybe.md#isempty)

### Methods

* [getOrElse](maybe.md#getorelse)
* [toString](maybe.md#tostring)
* [from](maybe.md#static-from)
* [isMaybe](maybe.md#static-ismaybe)
* [of](maybe.md#static-of)

## Properties

### `Static` EMPTY

▪ **EMPTY**: *[Maybe](maybe.md)‹[None](none.md)‹any››* = new Maybe(None.EMPTY)

Defined in packages/types/src/monads/primitive/maybe.monad.ts:21

## Accessors

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:46

Indicates if wrapped value is null | undefined | Nil | None

```ts
Maybe.of('').isEmpty // false
Maybe.of(Bool.FALSE).isEmpty // false
Maybe.of(false).isEmpty // false
Maybe.of([]).isEmpty // false
Maybe.of(null).isEmpty // true
Maybe.of(Nil).isEmpty // true
Maybe.of(None).isEmpty // true
Maybe.of(List.from()).isEmpty // false
Maybe.of(List.from([1)).isEmpty // false
```

**Returns:** *boolean*

## Methods

###  getOrElse

▸ **getOrElse**‹**M**, **R**›(`other`: M): *R*

*Implementation of [IMonad](../interfaces/imonad.md)*

*Overrides [Monad](monad.md).[getOrElse](monad.md#getorelse)*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:98

**Type parameters:**

▪ **M**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`other` | M |

**Returns:** *R*

___

###  toString

▸ **toString**(): *string*

*Overrides [Monad](monad.md).[toString](monad.md#tostring)*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:103

**Returns:** *string*

___

### `Static` from

▸ **from**‹**T**›(`val?`: T): *[Maybe](maybe.md)‹T›*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:94

Wraps passed value in Maybe, if not already a Maybe

**`see`** [Maybe.of](maybe.md#static-of)

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val?` | T |

**Returns:** *[Maybe](maybe.md)‹T›*

___

### `Static` isMaybe

▸ **isMaybe**‹**T**›(`val`: any): *val is Maybe<T>*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:55

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Maybe<T>*

___

### `Static` of

▸ **of**‹**T**›(`val?`: T | [None](none.md) | [Nil](nil.md)): *[Maybe](maybe.md)‹T›*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

Defined in packages/types/src/monads/primitive/maybe.monad.ts:76

Wraps passed value in Maybe regardless of what it is

```ts
const maybeString: Maybe<'foo'> = Maybe.of('foo');
maybeString.isEmpty // false
maybeString.get() // 'foo'

const maybeEmptyList: Maybe<List<string>> = Maybe.of(List.from([]));
maybeEmptyList.isEmpty // false
maybeEmptyList.get() // List<never>

const maybeEmptyList: Maybe<Maybe<string>> = Maybe.of(maybeString);
maybeEmptyList.isEmpty // false
maybeEmptyList.get() // Maybe<string>
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val?` | T &#124; [None](none.md) &#124; [Nil](nil.md) |

**Returns:** *[Maybe](maybe.md)‹T›*
