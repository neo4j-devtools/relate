[@relate/types](../README.md) › [Dict](dict.md)

# Class: Dict ‹**T, K, V**›

**`description`** 
Represents any Iterable value with named keys (i.e Object, Map)

If you just want to access the plain JS value, use `.get()`, `.toObject()`, or `.toArray()`:
```ts
const dict: Dict<{foo: 'bar'}> = Dict.from({foo: 'bar'});
const plain: {foo: 'bar'} = dict.get();
const asArr: [['foo', 'bar']] = dict.toArray();
const asObj: {foo: 'bar'} = dict.toObject();
```

## Type parameters

▪ **T**

▪ **K**

▪ **V**

## Hierarchy

  ↳ [List](list.md)‹[RawDict](../README.md#rawdict)‹K, V››

  ↳ **Dict**

## Implements

* [IMonad](../interfaces/imonad.md)‹Iterable‹[RawDict](../README.md#rawdict)‹K, V›››

## Index

### Accessors

* [isEmpty](dict.md#isempty)
* [keys](dict.md#keys)
* [values](dict.md#values)

### Methods

* [getKey](dict.md#getkey)
* [getValue](dict.md#getvalue)
* [hasIndex](dict.md#hasindex)
* [hasKey](dict.md#haskey)
* [merge](dict.md#merge)
* [omit](dict.md#omit)
* [toJSON](dict.md#tojson)
* [toList](dict.md#tolist)
* [toObject](dict.md#toobject)
* [toString](dict.md#tostring)
* [from](dict.md#static-from)
* [isDict](dict.md#static-isdict)
* [of](dict.md#static-of)

## Accessors

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [List](list.md).[isEmpty](list.md#isempty)*

*Defined in [src/monads/primitive/dict.monad.ts:75](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L75)*

Dict is empty if it has zero keys

**Returns:** *boolean*

___

###  keys

• **get keys**(): *[List](list.md)‹K›*

*Defined in [src/monads/primitive/dict.monad.ts:56](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L56)*

**Returns:** *[List](list.md)‹K›*

___

###  values

• **get values**(): *[List](list.md)‹V›*

*Defined in [src/monads/primitive/dict.monad.ts:64](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L64)*

**Returns:** *[List](list.md)‹V›*

## Methods

###  getKey

▸ **getKey**(`index`: number): *[Maybe](maybe.md)‹K›*

*Defined in [src/monads/primitive/dict.monad.ts:133](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L133)*

Gets key at index

**Parameters:**

Name | Type |
------ | ------ |
`index` | number |

**Returns:** *[Maybe](maybe.md)‹K›*

___

###  getValue

▸ **getValue**‹**O**, **R**›(`key`: O): *[Maybe](maybe.md)‹R›*

*Defined in [src/monads/primitive/dict.monad.ts:150](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L150)*

Gets value of named key

**Type parameters:**

▪ **O**: *K*

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`key` | O |

**Returns:** *[Maybe](maybe.md)‹R›*

___

###  hasIndex

▸ **hasIndex**(`index`: number | [Num](num.md)): *boolean*

*Overrides [List](list.md).[hasIndex](list.md#hasindex)*

*Defined in [src/monads/primitive/dict.monad.ts:124](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L124)*

Checks if a key exists and a given index

**Parameters:**

Name | Type |
------ | ------ |
`index` | number &#124; [Num](num.md) |

**Returns:** *boolean*

___

###  hasKey

▸ **hasKey**(`key`: K): *boolean*

*Defined in [src/monads/primitive/dict.monad.ts:142](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L142)*

Checks if named key exists

**Parameters:**

Name | Type |
------ | ------ |
`key` | K |

**Returns:** *boolean*

___

###  merge

▸ **merge**‹**O**›(`other`: O): *[Dict](dict.md)‹T & O›*

*Defined in [src/monads/primitive/dict.monad.ts:196](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L196)*

Merges two Dicts
```ts
const foo = Dict.from({foo: true});
const bar = Dict.from({bar: 1});
const fooBar = foo.merge(bar);
fooBar.toObject() // {foo: true, bar: 1}
```

**Type parameters:**

▪ **O**: *object*

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[Dict](dict.md)‹T & O›*

___

###  omit

▸ **omit**‹**K2**, **I**, **R**›(`other`: K2): *R*

*Defined in [src/monads/primitive/dict.monad.ts:176](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L176)*

Omits a key from the Dict
```ts
const fooBar = Dict.from({foo: true, bar: 1});
const foo = fooBar.omit('bar');
foo.toObject() // {foo: true}
```

**Type parameters:**

▪ **K2**: *keyof T*

▪ **I**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`other` | K2 |

**Returns:** *R*

▸ **omit**‹**K2**, **I**, **R**›(`other`: K2): *R*

*Defined in [src/monads/primitive/dict.monad.ts:178](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L178)*

Omits a key from the Dict
```ts
const fooBar = Dict.from({foo: true, bar: 1});
const foo = fooBar.omit('bar');
foo.toObject() // {foo: true}
```

**Type parameters:**

▪ **K2**: *KeyVal<T>["key"]*

▪ **I**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`other` | K2 |

**Returns:** *R*

___

###  toJSON

▸ **toJSON**(): *any*

*Overrides [Monad](monad.md).[toJSON](monad.md#tojson)*

*Defined in [src/monads/primitive/dict.monad.ts:223](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L223)*

**Returns:** *any*

___

###  toList

▸ **toList**(): *[List](list.md)‹[K, V]›*

*Defined in [src/monads/primitive/dict.monad.ts:219](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L219)*

Converts Dict to List
```ts
const fooBar = Dict.from({foo: true, bar: 1});
fooBar.toList().toArray() // [["foo", true], ["bar", 1]]
```

**Returns:** *[List](list.md)‹[K, V]›*

___

###  toObject

▸ **toObject**‹**O**, **R**›(): *R*

*Defined in [src/monads/primitive/dict.monad.ts:164](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L164)*

Converts original value to it's Object representation

**Type parameters:**

▪ **O**: *T*

▪ **R**

**Returns:** *R*

___

###  toString

▸ **toString**(): *string*

*Overrides [List](list.md).[toString](list.md#tostring)*

*Defined in [src/monads/primitive/dict.monad.ts:155](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L155)*

**Returns:** *string*

___

### `Static` from

▸ **from**‹**T**, **R**›(`val?`: T): *[Dict](dict.md)‹R›*

*Overrides [List](list.md).[from](list.md#static-from)*

*Defined in [src/monads/primitive/dict.monad.ts:117](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L117)*

Coerces any value to a Dict, if not one already

**`see`** [Dict.of](dict.md#static-of)

**Type parameters:**

▪ **T**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`val?` | T |

**Returns:** *[Dict](dict.md)‹R›*

___

### `Static` isDict

▸ **isDict**‹**T**›(`val`: any): *val is Dict<T>*

*Defined in [src/monads/primitive/dict.monad.ts:87](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L87)*

Indicates if passed value is an instance of `Dict`
```ts
if (Dict.isDict(val)) {
    // is a Dict
}
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Dict<T>*

___

### `Static` of

▸ **of**‹**T**›(`val`: T): *[Dict](dict.md)‹T›*

*Overrides [List](list.md).[of](list.md#static-of)*

*Defined in [src/monads/primitive/dict.monad.ts:105](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/primitive/dict.monad.ts#L105)*

Returns a Dict representing the passed value as a Map.

```ts
const empty = Dict.of([]);
empty.get() // Map<never, never>

const arr = Dict.of([['foo', 'bar']);
arr.get() // Map<string, string>

const list = Dict.of(List.of([['foo', 'bar']));
list.get() // Map<string, string>
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Dict](dict.md)‹T›*
