[@relate/types](../README.md) / [primitive/nil.monad](../modules/primitive_nil_monad.md) / default

# Class: default

[primitive/nil.monad](../modules/primitive_nil_monad.md).default

**`Description`**

Represents an null value

If you just want to access the plain JS value, use `.get()`:
```ts
const nil: Nil = Nil.from();
const plain: null = nil.get();
```

## Hierarchy

- [`default`](monad.default.md)<``null``\>

  ↳ **`default`**

## Table of contents

### Properties

- [NULL](primitive_nil_monad.default.md#null)

### Accessors

- [isEmpty](primitive_nil_monad.default.md#isempty)

### Methods

- [equals](primitive_nil_monad.default.md#equals)
- [flatMap](primitive_nil_monad.default.md#flatmap)
- [get](primitive_nil_monad.default.md#get)
- [getOrElse](primitive_nil_monad.default.md#getorelse)
- [isThis](primitive_nil_monad.default.md#isthis)
- [map](primitive_nil_monad.default.md#map)
- [switchMap](primitive_nil_monad.default.md#switchmap)
- [tap](primitive_nil_monad.default.md#tap)
- [toJSON](primitive_nil_monad.default.md#tojson)
- [toString](primitive_nil_monad.default.md#tostring)
- [valueOf](primitive_nil_monad.default.md#valueof)
- [from](primitive_nil_monad.default.md#from)
- [isMonad](primitive_nil_monad.default.md#ismonad)
- [isNil](primitive_nil_monad.default.md#isnil)
- [of](primitive_nil_monad.default.md#of)

## Properties

### NULL

▪ `Static` **NULL**: [`default`](primitive_nil_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/nil.monad.ts:14

## Accessors

### isEmpty

• `get` **isEmpty**(): ``true``

Nil is always empty

#### Returns

``true``

#### Overrides

Monad.isEmpty

#### Defined in

packages/types/src/monads/primitive/nil.monad.ts:26

## Methods

### equals

▸ **equals**(`other`): `boolean`

Checks if other has the same raw value

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `any` |

#### Returns

`boolean`

#### Inherited from

[default](monad.default.md).[equals](monad.default.md#equals)

#### Defined in

packages/types/src/monads/monad.ts:139

___

### flatMap

▸ **flatMap**<`M`\>(`project`): `M`

Unpack monad value and return anything.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: 'foo bar' = foo.flatMap((val) => `${val} bar`);
```

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: ``null``) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

packages/types/src/monads/monad.ts:180

___

### get

▸ **get**(): ``null``

Get raw value of monad

#### Returns

``null``

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

packages/types/src/monads/monad.ts:114

___

### getOrElse

▸ **getOrElse**(`other`): ``null``

Get raw value of monad if not empty, else use other
```ts
const otherWhenNotEmpty: 'foo' = Monad.of('foo').getOrElse('bar');
const otherWhenEmpty: 'bar' = Monad.of('').getOrElse('bar');
const throwWhenEmpty: never = Monad.of('').getOrElse(() => {
    throw new Error('empty');
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | ``null`` \| () => ``null`` |

#### Returns

``null``

#### Inherited from

[default](monad.default.md).[getOrElse](monad.default.md#getorelse)

#### Defined in

packages/types/src/monads/monad.ts:128

___

### isThis

▸ **isThis**(`val?`): val is default

Indicates if passed value is an instance of `this`
```ts
if (ours.isThis(other)) {
    // is instance of same constructor
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `any` |

#### Returns

val is default

#### Inherited from

[default](monad.default.md).[isThis](monad.default.md#isthis)

#### Defined in

packages/types/src/monads/monad.ts:57

___

### map

▸ **map**(`project`): [`default`](primitive_nil_monad.default.md)

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: ``null``) => ``null`` |

#### Returns

[`default`](primitive_nil_monad.default.md)

#### Inherited from

[default](monad.default.md).[map](monad.default.md#map)

#### Defined in

packages/types/src/monads/monad.ts:165

___

### switchMap

▸ **switchMap**<`M`\>(`project`): `M`

Switch monad for Iterable (of any type).
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Num<3> = foo.switchMap((val: Str) => Num.from(val.length));
```

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: [`default`](primitive_nil_monad.default.md)) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_nil_monad.default.md)

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: ``null``) => `void` |

#### Returns

[`default`](primitive_nil_monad.default.md)

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

packages/types/src/monads/monad.ts:152

___

### toJSON

▸ **toJSON**(): `any`

When calling `.toJSON()`

#### Returns

`any`

#### Inherited from

[default](monad.default.md).[toJSON](monad.default.md#tojson)

#### Defined in

packages/types/src/monads/monad.ts:205

___

### toString

▸ **toString**(): `string`

When calling `.toString()`

#### Returns

`string`

#### Inherited from

[default](monad.default.md).[toString](monad.default.md#tostring)

#### Defined in

packages/types/src/monads/monad.ts:198

___

### valueOf

▸ **valueOf**(): ``null``

When calling `.valueOf()`

#### Returns

``null``

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

packages/types/src/monads/monad.ts:212

___

### from

▸ `Static` **from**(`_?`): [`default`](primitive_nil_monad.default.md)

**`See`**

Nil.of

#### Parameters

| Name | Type |
| :------ | :------ |
| `_?` | `any` |

#### Returns

[`default`](primitive_nil_monad.default.md)

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/nil.monad.ts:60

___

### isMonad

▸ `Static` **isMonad**<`T`\>(`val`): val is default<T\>

Indicates if passed value is an instance of `Monad`
```ts
if (Monad.isMonad(val)) {
    // is a monad
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<T\>

#### Inherited from

[default](monad.default.md).[isMonad](monad.default.md#ismonad)

#### Defined in

packages/types/src/monads/monad.ts:76

___

### isNil

▸ `Static` **isNil**(`val`): val is default

Indicates if passed value is an instance of `Nil`
```ts
if (Nil.isNil(val)) {
    // is a Nil
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default

#### Defined in

packages/types/src/monads/primitive/nil.monad.ts:38

___

### of

▸ `Static` **of**(`_?`): [`default`](primitive_nil_monad.default.md)

Returns a Nil, regardless of value.

```ts
const strNil: Nil = Nil.of('foo');
const addNil: Nil = Nil.of([]);

const listMonad: List<string> = List.from(['']);
const listNil: Nil = Nil.of(listMonad);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `_?` | `any` |

#### Returns

[`default`](primitive_nil_monad.default.md)

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/nil.monad.ts:53
