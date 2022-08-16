[@relate/types](../README.md) / [primitive/maybe.monad](../modules/primitive_maybe_monad.md) / default

# Class: default<T\>

[primitive/maybe.monad](../modules/primitive_maybe_monad.md).default

**`Description`**

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

| Name |
| :------ |
| `T` |

## Hierarchy

- [`default`](monad.default.md)<`T` \| [`default`](primitive_none_monad.default.md)<`T`\>\>

  ↳ **`default`**

## Table of contents

### Properties

- [EMPTY](primitive_maybe_monad.default.md#empty)

### Accessors

- [isEmpty](primitive_maybe_monad.default.md#isempty)

### Methods

- [equals](primitive_maybe_monad.default.md#equals)
- [flatMap](primitive_maybe_monad.default.md#flatmap)
- [get](primitive_maybe_monad.default.md#get)
- [getOrElse](primitive_maybe_monad.default.md#getorelse)
- [isThis](primitive_maybe_monad.default.md#isthis)
- [map](primitive_maybe_monad.default.md#map)
- [switchMap](primitive_maybe_monad.default.md#switchmap)
- [tap](primitive_maybe_monad.default.md#tap)
- [toJSON](primitive_maybe_monad.default.md#tojson)
- [toString](primitive_maybe_monad.default.md#tostring)
- [valueOf](primitive_maybe_monad.default.md#valueof)
- [from](primitive_maybe_monad.default.md#from)
- [isMaybe](primitive_maybe_monad.default.md#ismaybe)
- [isMonad](primitive_maybe_monad.default.md#ismonad)
- [of](primitive_maybe_monad.default.md#of)

## Properties

### EMPTY

▪ `Static` **EMPTY**: [`default`](primitive_maybe_monad.default.md)<[`default`](primitive_none_monad.default.md)<`any`\>\>

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:20](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L20)

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

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

#### Returns

`boolean`

#### Overrides

Monad.isEmpty

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:45](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L45)

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
| `project` | (`value`: `T` \| [`default`](primitive_none_monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

[packages/types/src/monads/monad.ts:180](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L180)

___

### get

▸ **get**(): `T` \| [`default`](primitive_none_monad.default.md)<`T`\>

Get raw value of monad

#### Returns

`T` \| [`default`](primitive_none_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

[packages/types/src/monads/monad.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L114)

___

### getOrElse

▸ **getOrElse**<`M`, `R`\>(`other`): `R`

Get raw value of monad if not empty, else use other
```ts
const otherWhenNotEmpty: 'foo' = Monad.of('foo').getOrElse('bar');
const otherWhenEmpty: 'bar' = Monad.of('').getOrElse('bar');
const throwWhenEmpty: never = Monad.of('').getOrElse(() => {
    throw new Error('empty');
});
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `T` |
| `R` | `T` extends ``null`` ? `M` : `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `M` |

#### Returns

`R`

#### Overrides

[default](monad.default.md).[getOrElse](monad.default.md#getorelse)

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:97](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L97)

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

[packages/types/src/monads/monad.ts:57](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L57)

___

### map

▸ **map**(`project`): [`default`](primitive_maybe_monad.default.md)<`T`\>

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T` \| [`default`](primitive_none_monad.default.md)<`T`\>) => `T` \| [`default`](primitive_none_monad.default.md)<`T`\> |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[map](monad.default.md#map)

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
| `project` | (`value`: [`default`](primitive_maybe_monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

[packages/types/src/monads/monad.ts:191](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L191)

___

### tap

▸ **tap**(`project`): [`default`](primitive_maybe_monad.default.md)<`T`\>

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T` \| [`default`](primitive_none_monad.default.md)<`T`\>) => `void` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

[packages/types/src/monads/monad.ts:152](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L152)

___

### toJSON

▸ **toJSON**(): `any`

When calling `.toJSON()`

#### Returns

`any`

#### Inherited from

[default](monad.default.md).[toJSON](monad.default.md#tojson)

#### Defined in

[packages/types/src/monads/monad.ts:205](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L205)

___

### toString

▸ **toString**(): `string`

When calling `.toString()`

#### Returns

`string`

#### Overrides

[default](monad.default.md).[toString](monad.default.md#tostring)

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:102](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L102)

___

### valueOf

▸ **valueOf**(): `T` \| [`default`](primitive_none_monad.default.md)<`T`\>

When calling `.valueOf()`

#### Returns

`T` \| [`default`](primitive_none_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

[packages/types/src/monads/monad.ts:212](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L212)

___

### from

▸ `Static` **from**<`T`\>(`val?`): [`default`](primitive_maybe_monad.default.md)<`T`\>

Wraps passed value in Maybe, if not already a Maybe

**`See`**

Maybe.of

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `T` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:93](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L93)

___

### isMaybe

▸ `Static` **isMaybe**<`T`\>(`val`): val is default<T\>

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

[packages/types/src/monads/primitive/maybe.monad.ts:54](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L54)

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

[packages/types/src/monads/monad.ts:76](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L76)

___

### of

▸ `Static` **of**<`T`\>(`val?`): [`default`](primitive_maybe_monad.default.md)<`T`\>

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

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | [`default`](primitive_none_monad.default.md)<`any`\> \| [`default`](primitive_nil_monad.default.md) \| `T` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

[packages/types/src/monads/primitive/maybe.monad.ts:75](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/maybe.monad.ts#L75)
