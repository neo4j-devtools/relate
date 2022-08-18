[@relate/types](../README.md) / [primitive/none.monad](../modules/primitive_none_monad.md) / default

# Class: default<T\>

[primitive/none.monad](../modules/primitive_none_monad.md).default

**`Description`**

Represents an undefined value

If you just want to access the plain JS value, use `.get()`:
```ts
const none: None = None.from();
const plain: undefined = none.get();
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `any` = `any` |

## Hierarchy

- [`default`](monad.default.md)<`T`\>

  ↳ **`default`**

## Table of contents

### Properties

- [EMPTY](primitive_none_monad.default.md#empty)

### Accessors

- [isEmpty](primitive_none_monad.default.md#isempty)

### Methods

- [equals](primitive_none_monad.default.md#equals)
- [flatMap](primitive_none_monad.default.md#flatmap)
- [get](primitive_none_monad.default.md#get)
- [getOrElse](primitive_none_monad.default.md#getorelse)
- [isThis](primitive_none_monad.default.md#isthis)
- [map](primitive_none_monad.default.md#map)
- [switchMap](primitive_none_monad.default.md#switchmap)
- [tap](primitive_none_monad.default.md#tap)
- [toJSON](primitive_none_monad.default.md#tojson)
- [toString](primitive_none_monad.default.md#tostring)
- [valueOf](primitive_none_monad.default.md#valueof)
- [from](primitive_none_monad.default.md#from)
- [isMonad](primitive_none_monad.default.md#ismonad)
- [isNone](primitive_none_monad.default.md#isnone)
- [of](primitive_none_monad.default.md#of)

## Properties

### EMPTY

▪ `Static` **EMPTY**: [`default`](primitive_none_monad.default.md)<`any`\>

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:14

## Accessors

### isEmpty

• `get` **isEmpty**(): ``true``

None is always empty

#### Returns

``true``

#### Overrides

Monad.isEmpty

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:27

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
| `project` | (`value`: `T`) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

packages/types/src/monads/monad.ts:180

___

### get

▸ **get**(): `T`

Get raw value of monad

#### Returns

`T`

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

packages/types/src/monads/monad.ts:114

___

### getOrElse

▸ **getOrElse**(`other`): `T`

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
| `other` | `T` \| () => `T` |

#### Returns

`T`

#### Inherited from

[default](monad.default.md).[getOrElse](monad.default.md#getorelse)

#### Defined in

packages/types/src/monads/monad.ts:128

___

### isThis

▸ **isThis**(`val?`): val is default<T\>

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

val is default<T\>

#### Inherited from

[default](monad.default.md).[isThis](monad.default.md#isthis)

#### Defined in

packages/types/src/monads/monad.ts:57

___

### map

▸ **map**(`project`): [`default`](primitive_none_monad.default.md)<`T`\>

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T`) => `T` |

#### Returns

[`default`](primitive_none_monad.default.md)<`T`\>

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
| `project` | (`value`: [`default`](primitive_none_monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_none_monad.default.md)<`T`\>

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T`) => `void` |

#### Returns

[`default`](primitive_none_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

packages/types/src/monads/monad.ts:152

___

### toJSON

▸ **toJSON**(): `undefined`

None cannot be stringified

#### Returns

`undefined`

#### Overrides

[default](monad.default.md).[toJSON](monad.default.md#tojson)

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:72

___

### toString

▸ **toString**(): `string`

When calling `.toString()`

#### Returns

`string`

#### Overrides

[default](monad.default.md).[toString](monad.default.md#tostring)

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:65

___

### valueOf

▸ **valueOf**(): `T`

When calling `.valueOf()`

#### Returns

`T`

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

packages/types/src/monads/monad.ts:212

___

### from

▸ `Static` **from**<`T`\>(`_?`): [`default`](primitive_none_monad.default.md)<`T`\>

**`See`**

None.of

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_?` | `any` |

#### Returns

[`default`](primitive_none_monad.default.md)<`T`\>

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:61

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

### isNone

▸ `Static` **isNone**<`T`\>(`val`): val is default<T\>

Indicates if passed value is an instance of `None`
```ts
if (None.isNone(val)) {
    // is a None
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<T\>

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:39

___

### of

▸ `Static` **of**<`T`\>(`_?`): [`default`](primitive_none_monad.default.md)<`T`\>

Returns a None, regardless of value.

```ts
const strNone: None<string> = None.of('foo');
const addNone: None<never[]> = None.of([]);

const listMonad: List<string> = List.from(['']);
const listNone: None<List<string>> = None.of(listMonad);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `unknown` = `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `_?` | `any` |

#### Returns

[`default`](primitive_none_monad.default.md)<`T`\>

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/none.monad.ts:54
