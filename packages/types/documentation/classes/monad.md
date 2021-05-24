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

Defined in src/monads/monad.ts:64

Indicates if Monad lacks a value

**Returns:** *boolean*

## Methods

###  equals

▸ **equals**(`other`: any): *boolean*

Defined in src/monads/monad.ts:139

Checks if other has the same raw value

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  flatMap

▸ **flatMap**‹**M**›(`project`: function): *M*

Defined in src/monads/monad.ts:180

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

Defined in src/monads/monad.ts:114

Get raw value of monad

**Returns:** *T*

___

###  getOrElse

▸ **getOrElse**(`other`: T | function): *T*

Defined in src/monads/monad.ts:128

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

Defined in src/monads/monad.ts:57

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

Defined in src/monads/monad.ts:165

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

Defined in src/monads/monad.ts:191

Switch monad for Iterable (of any type).
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Num<3> = foo.switchMap((val: Str) => Num.from(val.length));
```

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

Defined in src/monads/monad.ts:152

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

Defined in src/monads/monad.ts:205

When calling `.toJSON()`

**Returns:** *any*

___

###  toString

▸ **toString**(): *string*

Defined in src/monads/monad.ts:198

When calling `.toString()`

**Returns:** *string*

___

###  valueOf

▸ **valueOf**(): *T*

Defined in src/monads/monad.ts:212

When calling `.valueOf()`

**Returns:** *T*

___

### `Static` from

▸ **from**(`val`: any): *[Monad](monad.md)‹any›*

Defined in src/monads/monad.ts:98

Wraps passed value in monad, if not already a Monad
```ts
const strMonad: Monad<'foo'> = Monad.from('foo');
const strMonadAgain: Monad<'foo'> = Monad.from(Monad.of('foo'));
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Monad](monad.md)‹any›*

___

### `Static` isMonad

▸ **isMonad**‹**T**›(`val`: any): *val is Monad<T>*

Defined in src/monads/monad.ts:76

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

▸ **of**(`val`: any): *[Monad](monad.md)‹any›*

Defined in src/monads/monad.ts:87

Wraps passed value in monad regardless of what it is
```ts
const strMonad: Monad<'foo'> = Monad.of('foo');
const strMonadMonad: Monad<Monad<'foo'>> = Monad.of(Monad.of('foo'));
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Monad](monad.md)‹any›*
