[@relate/types](../README.md) › [Str](str.md)

# Class: Str ‹**T**›

**`description`** 
Represents a String value

If you just want to access the plain JS value, use `.get()`:
```ts
const str: Str = Str.from(true);
const plain: 'true' = str.get();
```

## Type parameters

▪ **T**: *string*

## Hierarchy

* [Monad](monad.md)‹T›

  ↳ **Str**

## Implements

* [IMonad](../interfaces/imonad.md)‹T›

## Index

### Properties

* [EMPTY](str.md#static-empty)

### Accessors

* [isEmpty](str.md#isempty)

### Methods

* [includes](str.md#includes)
* [replace](str.md#replace)
* [split](str.md#split)
* [test](str.md#test)
* [from](str.md#static-from)
* [isStr](str.md#static-isstr)
* [of](str.md#static-of)

## Properties

### `Static` EMPTY

▪ **EMPTY**: *[Str](str.md)‹string›* = new Str('')

*Defined in [src/monads/primitive/str.monad.ts:19](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L19)*

## Accessors

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

*Defined in [src/monads/primitive/str.monad.ts:32](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L32)*

Returns true if value is empty string

**Returns:** *boolean*

## Methods

###  includes

▸ **includes**(`other`: string | [Str](str.md)): *boolean*

*Defined in [src/monads/primitive/str.monad.ts:80](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L80)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | string &#124; [Str](str.md) |

**Returns:** *boolean*

___

###  replace

▸ **replace**(`pattern`: string | RegExp | [Str](str.md), `replacement`: string | [Str](str.md)): *[Str](str.md)*

*Defined in [src/monads/primitive/str.monad.ts:88](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L88)*

**Parameters:**

Name | Type |
------ | ------ |
`pattern` | string &#124; RegExp &#124; [Str](str.md) |
`replacement` | string &#124; [Str](str.md) |

**Returns:** *[Str](str.md)*

___

###  split

▸ **split**(`sep`: string | [Str](str.md)): *[List](list.md)‹[Str](str.md)›*

*Defined in [src/monads/primitive/str.monad.ts:84](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L84)*

**Parameters:**

Name | Type |
------ | ------ |
`sep` | string &#124; [Str](str.md) |

**Returns:** *[List](list.md)‹[Str](str.md)›*

___

###  test

▸ **test**(`regex`: RegExp): *boolean*

*Defined in [src/monads/primitive/str.monad.ts:76](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L76)*

**Parameters:**

Name | Type |
------ | ------ |
`regex` | RegExp |

**Returns:** *boolean*

___

### `Static` from

▸ **from**‹**T**›(`val?`: any): *[Str](str.md)‹T›*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

*Defined in [src/monads/primitive/str.monad.ts:72](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L72)*

Coerces anything into a Str

**`see`** [Str.of](str.md#static-of)

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val?` | any |

**Returns:** *[Str](str.md)‹T›*

___

### `Static` isStr

▸ **isStr**‹**T**›(`val`: any): *val is Str<T>*

*Defined in [src/monads/primitive/str.monad.ts:44](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L44)*

Indicates if passed value is an instance of `Str`
```ts
if (Str.isStr(val)) {
    // is a Str
}
```

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Str<T>*

___

### `Static` of

▸ **of**‹**T**›(`val`: T): *[Str](str.md)‹T›*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

*Defined in [src/monads/primitive/str.monad.ts:63](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/str.monad.ts#L63)*

Returns Str representation of the passed value.

```ts
const strBool: Str<'true'> = Str.of(true);

const strMonad: Monad<'foo'> = Monad.from('foo');
const strBool: Str<'foo'> = Str.of(strMonad);

const strBool: Str<'1,2,3'> = Str.of([1,2,3]);

const listMonad: List<string> = List.from([1,2,3]);
const listBool: Str<'1,2,3'> = Str.of(listMonad);
```

**Type parameters:**

▪ **T**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Str](str.md)‹T›*
