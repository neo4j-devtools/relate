[@relate/types](../README.md) / [primitive/bool.monad](../modules/primitive_bool_monad.md) / default

# Class: default

[primitive/bool.monad](../modules/primitive_bool_monad.md).default

**`Description`**

Represents a Boolean value

If you just want to access the plain JS value, use `.get()`:
```ts
const bool: Bool = Bool.from(true);
const plain: boolean = bool.get();
```

## Hierarchy

- [`default`](monad.default.md)<`boolean`\>

  ↳ **`default`**

## Table of contents

### Properties

- [FALSE](primitive_bool_monad.default.md#false)
- [TRUE](primitive_bool_monad.default.md#true)

### Accessors

- [isEmpty](primitive_bool_monad.default.md#isempty)

### Methods

- [equals](primitive_bool_monad.default.md#equals)
- [flatMap](primitive_bool_monad.default.md#flatmap)
- [get](primitive_bool_monad.default.md#get)
- [getOrElse](primitive_bool_monad.default.md#getorelse)
- [isThis](primitive_bool_monad.default.md#isthis)
- [map](primitive_bool_monad.default.md#map)
- [switchMap](primitive_bool_monad.default.md#switchmap)
- [tap](primitive_bool_monad.default.md#tap)
- [toJSON](primitive_bool_monad.default.md#tojson)
- [toString](primitive_bool_monad.default.md#tostring)
- [valueOf](primitive_bool_monad.default.md#valueof)
- [from](primitive_bool_monad.default.md#from)
- [isBool](primitive_bool_monad.default.md#isbool)
- [isMonad](primitive_bool_monad.default.md#ismonad)
- [of](primitive_bool_monad.default.md#of)

## Properties

### FALSE

▪ `Static` **FALSE**: [`default`](primitive_bool_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:16

___

### TRUE

▪ `Static` **TRUE**: [`default`](primitive_bool_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:14

## Accessors

### isEmpty

• `get` **isEmpty**(): ``false``

Bool is never empty

#### Returns

``false``

#### Overrides

Monad.isEmpty

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:28

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
| `project` | (`value`: `boolean`) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

packages/types/src/monads/monad.ts:180

___

### get

▸ **get**(): `boolean`

Get raw value of monad

#### Returns

`boolean`

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

packages/types/src/monads/monad.ts:114

___

### getOrElse

▸ **getOrElse**(`other`): `boolean`

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
| `other` | `boolean` \| () => `boolean` |

#### Returns

`boolean`

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

▸ **map**(`project`): [`default`](primitive_bool_monad.default.md)

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `boolean`) => `boolean` |

#### Returns

[`default`](primitive_bool_monad.default.md)

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
| `project` | (`value`: [`default`](primitive_bool_monad.default.md)) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_bool_monad.default.md)

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `boolean`) => `void` |

#### Returns

[`default`](primitive_bool_monad.default.md)

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

▸ **valueOf**(): `boolean`

When calling `.valueOf()`

#### Returns

`boolean`

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

packages/types/src/monads/monad.ts:212

___

### from

▸ `Static` **from**(`val`): [`default`](primitive_bool_monad.default.md)

Coerces anything into a Bool

**`See`**

Bool.of

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`default`](primitive_bool_monad.default.md)

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:74

___

### isBool

▸ `Static` **isBool**(`val`): val is default

Indicates if passed value is an instance of `Bool`
```ts
if (Bool.isBool(val)) {
    // is a Bool
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:40

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

### of

▸ `Static` **of**(`val`): [`default`](primitive_bool_monad.default.md)

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

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `boolean` |

#### Returns

[`default`](primitive_bool_monad.default.md)

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/bool.monad.ts:64
