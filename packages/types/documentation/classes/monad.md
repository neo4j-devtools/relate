[@relate/types](../README.md) › [Monad](monad.md)

# Class: Monad ‹**T**›

**`description`** 
The base implementation for all Monadic types.

If you just want to access the plain JS value, use `.get()`:
```ts
const monad: Monad<number> = Monad.from(10);
const plain: number | undefined = monad.get();
```

## Type parameters

▪ **T**

## Hierarchy

* **Monad**

  ↳ [Bool](bool.md)

  ↳ [None](none.md)

  ↳ [Nil](nil.md)

  ↳ [Maybe](maybe.md)

  ↳ [Num](num.md)

  ↳ [Str](str.md)

  ↳ [List](list.md)

## Implements

* [IMonad](../interfaces/imonad.md)‹T›

## Index

### Accessors

* [isEmpty](monad.md#isempty)

### Methods

* [equals](monad.md#equals)
* [flatMap](monad.md#flatmap)
* [get](monad.md#get)
* [getOrElse](monad.md#getorelse)
* [isThis](monad.md#isthis)
* [map](monad.md#map)
* [switchMap](monad.md#switchmap)
* [tap](monad.md#tap)
* [toJSON](monad.md#tojson)
* [toString](monad.md#tostring)
* [valueOf](monad.md#valueof)
* [from](monad.md#static-from)
* [isMonad](monad.md#static-ismonad)
* [of](monad.md#static-of)

## Accessors

###  isEmpty

• **get isEmpty**(): *boolean*

*Defined in [src/monads/monad.ts:60](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L60)*

Indicates if Monad lacks a value

**Returns:** *boolean*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

*Defined in [src/monads/monad.ts:136](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L136)*

Checks if other has the same raw value

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  flatMap

▸ **flatMap**‹**M**›(`project`: function): *M*

*Defined in [src/monads/monad.ts:177](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L177)*

Unpack monad value and return anything.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: 'foo bar' = foo.flatMap((val) => `${val} bar`);
```

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

▸ **get**(): *T*

*Implementation of [IMonad](../interfaces/imonad.md)*

*Defined in [src/monads/monad.ts:111](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L111)*

Get raw value of monad

**Returns:** *T*

___

###  getOrElse

▸ **getOrElse**(`other`: T | function): *T*

*Defined in [src/monads/monad.ts:125](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L125)*

Get raw value of monad if not empty, else use other
```ts
const otherWhenNotEmpty: 'foo' = Monad.of('foo').getOrElse('bar');
const otherWhenEmpty: 'bar' = Monad.of('').getOrElse('bar');
const throwWhenEmpty: never = Monad.of('').getOrElse(() => {
    throw new Error('empty');
});
```

**Parameters:**

Name | Type |
------ | ------ |
`other` | T &#124; function |

**Returns:** *T*

___

###  isThis

▸ **isThis**(`val?`: any): *val is this*

*Implementation of [IMonad](../interfaces/imonad.md)*

*Defined in [src/monads/monad.ts:53](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L53)*

Indicates if passed value is an instance of `this`
```ts
if (ours.isThis(other)) {
    // is instance of same constructor
}
```

**Parameters:**

Name | Type |
------ | ------ |
`val?` | any |

**Returns:** *val is this*

___

###  map

▸ **map**(`project`: function): *this*

*Defined in [src/monads/monad.ts:162](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L162)*

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

**Parameters:**

▪ **project**: *function*

▸ (`value`: T): *T*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *this*

___

###  switchMap

▸ **switchMap**‹**M**›(`project`: function): *M*

*Defined in [src/monads/monad.ts:188](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L188)*

Unpack monad value and return new Monad (of any type).
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Num<7> = foo.switchMap((val) => Num.from(val.length));
```

**Type parameters:**

▪ **M**: *[IMonad](../interfaces/imonad.md)‹any›*

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

*Defined in [src/monads/monad.ts:149](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L149)*

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

**Parameters:**

▪ **project**: *function*

▸ (`value`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`value` | T |

**Returns:** *this*

___

###  toJSON

▸ **toJSON**(): *any*

*Defined in [src/monads/monad.ts:202](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L202)*

When calling `.toJSON()`

**Returns:** *any*

___

###  toString

▸ **toString**(): *string*

*Defined in [src/monads/monad.ts:195](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L195)*

When calling `.toString()`

**Returns:** *string*

___

###  valueOf

▸ **valueOf**(): *T*

*Defined in [src/monads/monad.ts:209](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L209)*

When calling `.valueOf()`

**Returns:** *T*

___

### `Static` from

▸ **from**‹**T**, **R**›(`val`: T): *[Monad](monad.md)‹R›*

*Defined in [src/monads/monad.ts:94](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L94)*

Wraps passed value in monad, if not already a Monad
```ts
const strMonad: Monad<'foo'> = Monad.from('foo');
const strMonadAgain: Monad<'foo'> = Monad.from(Monad.of('foo'));
```

**Type parameters:**

▪ **T**

▪ **R**

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Monad](monad.md)‹R›*

___

### `Static` isMonad

▸ **isMonad**‹**T**›(`val`: any): *val is Monad<T>*

*Defined in [src/monads/monad.ts:72](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L72)*

Indicates if passed value is an instance of `Monad`
```ts
if (Monad.isMonad(val)) {
    // is a monad
}
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Monad<T>*

___

### `Static` of

▸ **of**‹**T**›(`val`: T): *[Monad](monad.md)‹T›*

*Defined in [src/monads/monad.ts:83](https://github.com/neo-technology/relate/blob/master/packages/types/src/monads/monad.ts#L83)*

Wraps passed value in monad regardless of what it is
```ts
const strMonad: Monad<'foo'> = Monad.of('foo');
const strMonadMonad: Monad<Monad<'foo'>> = Monad.of(Monad.of('foo'));
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Monad](monad.md)‹T›*
