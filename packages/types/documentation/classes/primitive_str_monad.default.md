[@relate/types](../README.md) / [primitive/str.monad](../modules/primitive_str_monad.md) / default

# Class: default<T\>

[primitive/str.monad](../modules/primitive_str_monad.md).default

**`Description`**

Represents a String value

If you just want to access the plain JS value, use `.get()`:
```ts
const str: Str = Str.from(true);
const plain: 'true' = str.get();
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` = `string` |

## Hierarchy

- [`default`](monad.default.md)<`T`\>

  ↳ **`default`**

## Table of contents

### Properties

- [EMPTY](primitive_str_monad.default.md#empty)

### Accessors

- [isEmpty](primitive_str_monad.default.md#isempty)

### Methods

- [endsWith](primitive_str_monad.default.md#endswith)
- [equals](primitive_str_monad.default.md#equals)
- [flatMap](primitive_str_monad.default.md#flatmap)
- [get](primitive_str_monad.default.md#get)
- [getOrElse](primitive_str_monad.default.md#getorelse)
- [includes](primitive_str_monad.default.md#includes)
- [isThis](primitive_str_monad.default.md#isthis)
- [map](primitive_str_monad.default.md#map)
- [replace](primitive_str_monad.default.md#replace)
- [split](primitive_str_monad.default.md#split)
- [startsWith](primitive_str_monad.default.md#startswith)
- [switchMap](primitive_str_monad.default.md#switchmap)
- [tap](primitive_str_monad.default.md#tap)
- [test](primitive_str_monad.default.md#test)
- [toJSON](primitive_str_monad.default.md#tojson)
- [toString](primitive_str_monad.default.md#tostring)
- [trim](primitive_str_monad.default.md#trim)
- [valueOf](primitive_str_monad.default.md#valueof)
- [from](primitive_str_monad.default.md#from)
- [isMonad](primitive_str_monad.default.md#ismonad)
- [isStr](primitive_str_monad.default.md#isstr)
- [of](primitive_str_monad.default.md#of)

## Properties

### EMPTY

▪ `Static` **EMPTY**: [`default`](primitive_str_monad.default.md)<`string`\>

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:17

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

Returns true if value is empty string

#### Returns

`boolean`

#### Overrides

Monad.isEmpty

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:30

## Methods

### endsWith

▸ **endsWith**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:96

___

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

### includes

▸ **includes**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:88

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

▸ **map**(`project`): [`default`](primitive_str_monad.default.md)<`T`\>

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

[`default`](primitive_str_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[map](monad.default.md#map)

#### Defined in

packages/types/src/monads/monad.ts:165

___

### replace

▸ **replace**(`pattern`, `replacement`): [`default`](primitive_str_monad.default.md)<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `pattern` | `string` \| `RegExp` \| [`default`](primitive_str_monad.default.md)<`string`\> |
| `replacement` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

[`default`](primitive_str_monad.default.md)<`string`\>

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:104

___

### split

▸ **split**(`sep`): [`default`](primitive_list_monad.default.md)<[`default`](primitive_str_monad.default.md)<`string`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sep` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<[`default`](primitive_str_monad.default.md)<`string`\>\>

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:100

___

### startsWith

▸ **startsWith**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:92

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
| `project` | (`value`: [`default`](primitive_str_monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_str_monad.default.md)<`T`\>

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

[`default`](primitive_str_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

packages/types/src/monads/monad.ts:152

___

### test

▸ **test**(`regex`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `regex` | `RegExp` |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:84

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

### trim

▸ **trim**(): [`default`](primitive_str_monad.default.md)<`string`\>

#### Returns

[`default`](primitive_str_monad.default.md)<`string`\>

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:108

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

▸ `Static` **from**<`T`, `R`\>(`val?`): [`default`](primitive_str_monad.default.md)<`R`\>

Coerces anything into a Str

**`See`**

Str.of

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `string` |
| `R` | `T` extends `string` ? `T` : `T` extends [`default`](primitive_str_monad.default.md)<`V`\> ? `V` : `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `T` |

#### Returns

[`default`](primitive_str_monad.default.md)<`R`\>

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:69

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

### isStr

▸ `Static` **isStr**<`T`\>(`val`): val is default<T\>

Indicates if passed value is an instance of `Str`
```ts
if (Str.isStr(val)) {
    // is a Str
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` = `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<T\>

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:42

___

### of

▸ `Static` **of**<`T`\>(`val`): [`default`](primitive_str_monad.default.md)<`T`\>

Returns Str representation of the passed value.

```ts
const strBool: Str<'true'> = Str.of(true);

const strMonad: Monad<'foo'> = Monad.from('foo');
const strBool: Str<'foo'> = Str.of(strMonad);

const strBool: Str<'1,2,3'> = Str.of([1,2,3]);

const listMonad: List<string> = List.from([1,2,3]);
const listStr: Str<'1,2,3'> = Str.of(listMonad);
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `T` |

#### Returns

[`default`](primitive_str_monad.default.md)<`T`\>

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/str.monad.ts:61
