[@relate/types](../README.md) / [monad](../modules/monad.md) / default

# Class: default<T\>

[monad](../modules/monad.md).default

**`Description`**

The base implementation for all Monadic types.

If you just want to access the plain JS value, use `.get()`:
```ts
const monad: Monad<number> = Monad.from(10);
const plain: number | undefined = monad.get();
```

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- **`default`**

  ↳ [`default`](primitive_bool_monad.default.md)

  ↳ [`default`](primitive_list_monad.default.md)

  ↳ [`default`](primitive_maybe_monad.default.md)

  ↳ [`default`](primitive_nil_monad.default.md)

  ↳ [`default`](primitive_none_monad.default.md)

  ↳ [`default`](primitive_num_monad.default.md)

  ↳ [`default`](primitive_str_monad.default.md)

## Implements

- [`IMonad`](../interfaces/monad.IMonad.md)<`T`\>

## Table of contents

### Accessors

- [isEmpty](monad.default.md#isempty)

### Methods

- [equals](monad.default.md#equals)
- [flatMap](monad.default.md#flatmap)
- [get](monad.default.md#get)
- [getOrElse](monad.default.md#getorelse)
- [isThis](monad.default.md#isthis)
- [map](monad.default.md#map)
- [switchMap](monad.default.md#switchmap)
- [tap](monad.default.md#tap)
- [toJSON](monad.default.md#tojson)
- [toString](monad.default.md#tostring)
- [valueOf](monad.default.md#valueof)
- [from](monad.default.md#from)
- [isMonad](monad.default.md#ismonad)
- [of](monad.default.md#of)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

Indicates if Monad lacks a value

#### Returns

`boolean`

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[isEmpty](../interfaces/monad.IMonad.md#isempty)

#### Defined in

[packages/types/src/monads/monad.ts:64](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L64)

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

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[equals](../interfaces/monad.IMonad.md#equals)

#### Defined in

[packages/types/src/monads/monad.ts:139](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L139)

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

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[flatMap](../interfaces/monad.IMonad.md#flatmap)

#### Defined in

[packages/types/src/monads/monad.ts:180](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L180)

___

### get

▸ **get**(): `T`

Get raw value of monad

#### Returns

`T`

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[get](../interfaces/monad.IMonad.md#get)

#### Defined in

[packages/types/src/monads/monad.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L114)

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

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[getOrElse](../interfaces/monad.IMonad.md#getorelse)

#### Defined in

[packages/types/src/monads/monad.ts:128](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L128)

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

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[isThis](../interfaces/monad.IMonad.md#isthis)

#### Defined in

[packages/types/src/monads/monad.ts:57](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L57)

___

### map

▸ **map**(`project`): [`default`](monad.default.md)<`T`\>

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

[`default`](monad.default.md)<`T`\>

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[map](../interfaces/monad.IMonad.md#map)

#### Defined in

[packages/types/src/monads/monad.ts:165](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L165)

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
| `project` | (`value`: [`default`](monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[switchMap](../interfaces/monad.IMonad.md#switchmap)

#### Defined in

[packages/types/src/monads/monad.ts:191](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L191)

___

### tap

▸ **tap**(`project`): [`default`](monad.default.md)<`T`\>

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

[`default`](monad.default.md)<`T`\>

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[tap](../interfaces/monad.IMonad.md#tap)

#### Defined in

[packages/types/src/monads/monad.ts:152](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L152)

___

### toJSON

▸ **toJSON**(): `any`

When calling `.toJSON()`

#### Returns

`any`

#### Defined in

[packages/types/src/monads/monad.ts:205](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L205)

___

### toString

▸ **toString**(): `string`

When calling `.toString()`

#### Returns

`string`

#### Implementation of

[IMonad](../interfaces/monad.IMonad.md).[toString](../interfaces/monad.IMonad.md#tostring)

#### Defined in

[packages/types/src/monads/monad.ts:198](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L198)

___

### valueOf

▸ **valueOf**(): `T`

When calling `.valueOf()`

#### Returns

`T`

#### Defined in

[packages/types/src/monads/monad.ts:212](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L212)

___

### from

▸ `Static` **from**(`val`): [`default`](monad.default.md)<`any`\>

Wraps passed value in monad, if not already a Monad
```ts
const strMonad: Monad<'foo'> = Monad.from('foo');
const strMonadAgain: Monad<'foo'> = Monad.from(Monad.of('foo'));
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`default`](monad.default.md)<`any`\>

#### Defined in

[packages/types/src/monads/monad.ts:98](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L98)

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

#### Defined in

[packages/types/src/monads/monad.ts:76](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L76)

___

### of

▸ `Static` **of**(`val`): [`default`](monad.default.md)<`any`\>

Wraps passed value in monad regardless of what it is
```ts
const strMonad: Monad<'foo'> = Monad.of('foo');
const strMonadMonad: Monad<Monad<'foo'>> = Monad.of(Monad.of('foo'));
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`default`](monad.default.md)<`any`\>

#### Defined in

[packages/types/src/monads/monad.ts:87](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L87)
