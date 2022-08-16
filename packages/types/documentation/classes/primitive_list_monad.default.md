[@relate/types](../README.md) / [primitive/list.monad](../modules/primitive_list_monad.md) / default

# Class: default<T\>

[primitive/list.monad](../modules/primitive_list_monad.md).default

**`Description`**

Represents any Iterable value (i.e Array, String, Map, Set, etc.)

If you just want to access the plain JS value, use `.get()` or `.toArray()`:
```ts
const list: List<string> = List.from('foo');
const plain: 'foo' = list.get();
const asArr: ['f', 'o', 'o'] = list.toArray();

const list: List<number> = List.from([1,2,3]);
const plain: [1,2,3] = list.get();
const asArr: [1,2,3] = list.toArray();
```

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- [`default`](monad.default.md)<`Iterable`<`T`\>\>

  ↳ **`default`**

  ↳↳ [`default`](primitive_dict_monad.default.md)

## Table of contents

### Accessors

- [first](primitive_list_monad.default.md#first)
- [isEmpty](primitive_list_monad.default.md#isempty)
- [last](primitive_list_monad.default.md#last)
- [length](primitive_list_monad.default.md#length)

### Methods

- [compact](primitive_list_monad.default.md#compact)
- [concat](primitive_list_monad.default.md#concat)
- [equals](primitive_list_monad.default.md#equals)
- [filter](primitive_list_monad.default.md#filter)
- [find](primitive_list_monad.default.md#find)
- [flatMap](primitive_list_monad.default.md#flatmap)
- [flatten](primitive_list_monad.default.md#flatten)
- [forEach](primitive_list_monad.default.md#foreach)
- [get](primitive_list_monad.default.md#get)
- [getOrElse](primitive_list_monad.default.md#getorelse)
- [hasIndex](primitive_list_monad.default.md#hasindex)
- [includes](primitive_list_monad.default.md#includes)
- [indexOf](primitive_list_monad.default.md#indexof)
- [isThis](primitive_list_monad.default.md#isthis)
- [join](primitive_list_monad.default.md#join)
- [map](primitive_list_monad.default.md#map)
- [mapEach](primitive_list_monad.default.md#mapeach)
- [nth](primitive_list_monad.default.md#nth)
- [reduce](primitive_list_monad.default.md#reduce)
- [slice](primitive_list_monad.default.md#slice)
- [sort](primitive_list_monad.default.md#sort)
- [switchMap](primitive_list_monad.default.md#switchmap)
- [tap](primitive_list_monad.default.md#tap)
- [toArray](primitive_list_monad.default.md#toarray)
- [toJSON](primitive_list_monad.default.md#tojson)
- [toString](primitive_list_monad.default.md#tostring)
- [unique](primitive_list_monad.default.md#unique)
- [unwindPromises](primitive_list_monad.default.md#unwindpromises)
- [valueOf](primitive_list_monad.default.md#valueof)
- [without](primitive_list_monad.default.md#without)
- [from](primitive_list_monad.default.md#from)
- [isList](primitive_list_monad.default.md#islist)
- [isMonad](primitive_list_monad.default.md#ismonad)
- [of](primitive_list_monad.default.md#of)

## Accessors

### first

• `get` **first**(): [`default`](primitive_maybe_monad.default.md)<`T`\>

Returns a Maybe of the first element in the sequence

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:59](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L59)

___

### isEmpty

• `get` **isEmpty**(): `boolean`

List are empty if length is zero

#### Returns

`boolean`

#### Overrides

Monad.isEmpty

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:48](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L48)

___

### last

• `get` **last**(): [`default`](primitive_maybe_monad.default.md)<`T`\>

Returns a Maybe of the last element in the sequence

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:92](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L92)

___

### length

• `get` **length**(): [`default`](primitive_num_monad.default.md)

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:52](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L52)

## Methods

### compact

▸ **compact**<`R`\>(): [`default`](primitive_list_monad.default.md)<`R`\>

Remove all null, undefined, None, or Nil values (shallow)
```ts
const listOfEmpties = List.from([[], 'foo', null, None])
const compacted = listOfEmpties.compact()
compacted.toArray() // [[], 'foo']
```

#### Type parameters

| Name |
| :------ |
| `R` |

#### Returns

[`default`](primitive_list_monad.default.md)<`R`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:198](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L198)

___

### concat

▸ **concat**<`O`\>(`other`): [`default`](primitive_list_monad.default.md)<`T` \| `O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends [`default`](primitive_str_monad.default.md)<`any`, `O`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T` \| `O`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:282](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L282)

▸ **concat**<`O`\>(`other`): [`default`](primitive_list_monad.default.md)<`T` \| `O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T` \| `O`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:284](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L284)

▸ **concat**<`O`, `I`\>(`other`): [`default`](primitive_list_monad.default.md)<`T` \| `I`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | `O` |
| `I` | `O` extends `Iterable`<`L`\> ? `L` : `O` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T` \| `I`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:286](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L286)

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

[packages/types/src/monads/monad.ts:139](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L139)

___

### filter

▸ **filter**(`predicate`): [`default`](primitive_list_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`val`: `T`) => `boolean` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:180](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L180)

___

### find

▸ **find**(`predicate`): [`default`](primitive_maybe_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`val`: `T`) => `boolean` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:167](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L167)

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
| `project` | (`value`: `Iterable`<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

[packages/types/src/monads/monad.ts:180](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L180)

___

### flatten

▸ **flatten**<`R`\>(): [`default`](primitive_list_monad.default.md)<`R`\>

Flattens all iterable items (shallow)
```ts
const listOfLists = List.from([[], 'foo', [2], List.from(true)])
const flat = listOfLists.flatten()
flat.toArray() // ['f', 'o', 'o', 2, true]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `T` extends [`default`](primitive_list_monad.default.md)<`I`\> ? `I` : `T` |

#### Returns

[`default`](primitive_list_monad.default.md)<`R`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:308](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L308)

___

### forEach

▸ **forEach**(`project`): [`default`](primitive_list_monad.default.md)<`T`\>

Iterate over each item in the List, without modifying value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `project` | (`val`: `T`) => `void` | callback invoked for each item ```ts const start = List.from([1,2,3]) const end = start.forEach((v) => v+1); end.toArray() // [1,2,3] ``` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:239](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L239)

___

### get

▸ **get**(): `Iterable`<`T`\>

Get raw value of monad

#### Returns

`Iterable`<`T`\>

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

[packages/types/src/monads/monad.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L114)

___

### getOrElse

▸ **getOrElse**(`other`): `Iterable`<`T`\>

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
| `other` | `Iterable`<`T`\> \| () => `Iterable`<`T`\> |

#### Returns

`Iterable`<`T`\>

#### Inherited from

[default](monad.default.md).[getOrElse](monad.default.md#getorelse)

#### Defined in

[packages/types/src/monads/monad.ts:128](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L128)

___

### hasIndex

▸ **hasIndex**(`index`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:161](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L161)

___

### includes

▸ **includes**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `T` |

#### Returns

`boolean`

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:173](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L173)

___

### indexOf

▸ **indexOf**(`val`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `T` |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:245](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L245)

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

### join

▸ **join**(`separator?`): [`default`](primitive_str_monad.default.md)<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `separator?` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

[`default`](primitive_str_monad.default.md)<`string`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:316](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L316)

___

### map

▸ **map**(`project`): [`default`](primitive_list_monad.default.md)<`T`\>

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `Iterable`<`T`\>) => `Iterable`<`T`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[map](monad.default.md#map)

#### Defined in

[packages/types/src/monads/monad.ts:165](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L165)

___

### mapEach

▸ **mapEach**<`M`\>(`project`): [`default`](primitive_list_monad.default.md)<`M`\>

Map over each item in the List, modifying each value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `T` |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `project` | (`val`: `T`) => `M` | callback invoked for each item ```ts const start = List.from([1,2,3]) const end = start.mapEach((v) => v+1); end.toArray() // [2,3,4] ``` |

#### Returns

[`default`](primitive_list_monad.default.md)<`M`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:226](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L226)

___

### nth

▸ **nth**(`index`): [`default`](primitive_maybe_monad.default.md)<`T`\>

Returns a Maybe of the nth element in the sequence

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:74](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L74)

___

### reduce

▸ **reduce**<`R`\>(`cb`, `seed`): `R`

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `cb` | (`agg`: `R`, `next`: `T`, `index`: `number`) => `R` |
| `seed` | `R` |

#### Returns

`R`

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:205](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L205)

___

### slice

▸ **slice**(`from`, `to?`): [`default`](primitive_list_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `number` \| [`default`](primitive_num_monad.default.md) |
| `to?` | `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:260](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L260)

___

### sort

▸ **sort**(`compareFn?`): [`default`](primitive_list_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `compareFn?` | (`a`: `T`, `b`: `T`) => `number` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:312](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L312)

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
| `project` | (`value`: [`default`](primitive_list_monad.default.md)<`T`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

[packages/types/src/monads/monad.ts:191](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L191)

___

### tap

▸ **tap**(`project`): [`default`](primitive_list_monad.default.md)<`T`\>

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `Iterable`<`T`\>) => `void` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

[packages/types/src/monads/monad.ts:152](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L152)

___

### toArray

▸ **toArray**(): `T`[]

#### Returns

`T`[]

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:334](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L334)

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

[packages/types/src/monads/primitive/list.monad.ts:330](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L330)

___

### unique

▸ **unique**(`predicate?`): [`default`](primitive_list_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate?` | (`val`: `T`) => `any` |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:320](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L320)

___

### unwindPromises

▸ **unwindPromises**<`R`\>(): `Promise`<[`default`](primitive_list_monad.default.md)<`R`\>\>

Unwinds any promises in list (shallow), using Promise.all()

```ts
const listOfPromises = List.from(['foo', Promise.resolve(2), Promise.resolve([])])
const unwound = await listOfPromises.unwindPromises()
unwound.toArray() // ['foo', 2, []]
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | `T` extends `PromiseLike`<`V`\> ? `V` : `T` |

#### Returns

`Promise`<[`default`](primitive_list_monad.default.md)<`R`\>\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:347](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L347)

___

### valueOf

▸ **valueOf**(): `Iterable`<`T`\>

When calling `.valueOf()`

#### Returns

`Iterable`<`T`\>

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

[packages/types/src/monads/monad.ts:212](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/monad.ts#L212)

___

### without

▸ **without**(...`other`): [`default`](primitive_list_monad.default.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...other` | `T`[] |

#### Returns

[`default`](primitive_list_monad.default.md)<`T`\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:186](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L186)

___

### from

▸ `Static` **from**<`L`\>(`val?`): [`default`](primitive_list_monad.default.md)<`L`\>

Coerces any value to a List, if not one already

**`See`**

List.of

#### Type parameters

| Name |
| :------ |
| `L` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | ``null`` \| `Iterable`<`L`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<`L`\>

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:143](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L143)

___

### isList

▸ `Static` **isList**<`L`\>(`val`): val is default<L\>

Indicates if passed value is an instance of `List`
```ts
if (List.isList(val)) {
    // is a List
}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `L` | `any` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<L\>

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:112](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L112)

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

▸ `Static` **of**<`L`\>(`val`): [`default`](primitive_list_monad.default.md)<`L`\>

Returns a List representing the passed value as an Iterable.

```ts
const strList: List<string> = List.of('foo');
List.get(); // ['f', 'o', 'o']

const boolList: List<boolean> = List.of(true);
List.get(); // [true]

const listMonad: List<string> = List.from(['']);
List.get(); // ['']

const listMonad: List<string> = List.from([]);
const listList: List<false> = List.of(listMonad);
```

#### Type parameters

| Name |
| :------ |
| `L` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `Iterable`<`L`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<`L`\>

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

[packages/types/src/monads/primitive/list.monad.ts:133](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L133)
