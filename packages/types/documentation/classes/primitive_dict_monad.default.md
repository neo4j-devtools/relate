[@relate/types](../README.md) / [primitive/dict.monad](../modules/primitive_dict_monad.md) / default

# Class: default<T, K, V\>

[primitive/dict.monad](../modules/primitive_dict_monad.md).default

**`Description`**

Represents any Iterable value with named keys (i.e Object, Map)

If you just want to access the plain JS value, use `.get()`, `.toObject()`, or `.toArray()`:
```ts
const dict: Dict<{foo: 'bar'}> = Dict.from({foo: 'bar'});
const plain: {foo: 'bar'} = dict.get();
const asArr: [['foo', 'bar']] = dict.toArray();
const asObj: {foo: 'bar'} = dict.toObject();
```

## Type parameters

| Name | Type |
| :------ | :------ |
| `T` | `any` |
| `K` | `KeyVal`<`T`\>[``"key"``] |
| `V` | `KeyVal`<`T`\>[``"value"``] |

## Hierarchy

- [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

  ↳ **`default`**

## Table of contents

### Accessors

- [first](primitive_dict_monad.default.md#first)
- [isEmpty](primitive_dict_monad.default.md#isempty)
- [keys](primitive_dict_monad.default.md#keys)
- [last](primitive_dict_monad.default.md#last)
- [length](primitive_dict_monad.default.md#length)
- [values](primitive_dict_monad.default.md#values)

### Methods

- [assign](primitive_dict_monad.default.md#assign)
- [compact](primitive_dict_monad.default.md#compact)
- [concat](primitive_dict_monad.default.md#concat)
- [equals](primitive_dict_monad.default.md#equals)
- [filter](primitive_dict_monad.default.md#filter)
- [find](primitive_dict_monad.default.md#find)
- [flatMap](primitive_dict_monad.default.md#flatmap)
- [flatten](primitive_dict_monad.default.md#flatten)
- [forEach](primitive_dict_monad.default.md#foreach)
- [get](primitive_dict_monad.default.md#get)
- [getKey](primitive_dict_monad.default.md#getkey)
- [getOrElse](primitive_dict_monad.default.md#getorelse)
- [getValue](primitive_dict_monad.default.md#getvalue)
- [hasIndex](primitive_dict_monad.default.md#hasindex)
- [hasKey](primitive_dict_monad.default.md#haskey)
- [includes](primitive_dict_monad.default.md#includes)
- [indexOf](primitive_dict_monad.default.md#indexof)
- [isThis](primitive_dict_monad.default.md#isthis)
- [join](primitive_dict_monad.default.md#join)
- [map](primitive_dict_monad.default.md#map)
- [mapEach](primitive_dict_monad.default.md#mapeach)
- [merge](primitive_dict_monad.default.md#merge)
- [nth](primitive_dict_monad.default.md#nth)
- [omit](primitive_dict_monad.default.md#omit)
- [reduce](primitive_dict_monad.default.md#reduce)
- [setValue](primitive_dict_monad.default.md#setvalue)
- [slice](primitive_dict_monad.default.md#slice)
- [sort](primitive_dict_monad.default.md#sort)
- [switchMap](primitive_dict_monad.default.md#switchmap)
- [tap](primitive_dict_monad.default.md#tap)
- [toArray](primitive_dict_monad.default.md#toarray)
- [toJSON](primitive_dict_monad.default.md#tojson)
- [toList](primitive_dict_monad.default.md#tolist)
- [toObject](primitive_dict_monad.default.md#toobject)
- [toString](primitive_dict_monad.default.md#tostring)
- [unique](primitive_dict_monad.default.md#unique)
- [unwindPromises](primitive_dict_monad.default.md#unwindpromises)
- [valueOf](primitive_dict_monad.default.md#valueof)
- [without](primitive_dict_monad.default.md#without)
- [from](primitive_dict_monad.default.md#from)
- [isDict](primitive_dict_monad.default.md#isdict)
- [isList](primitive_dict_monad.default.md#islist)
- [isMonad](primitive_dict_monad.default.md#ismonad)
- [of](primitive_dict_monad.default.md#of)

## Accessors

### first

• `get` **first**(): [`default`](primitive_maybe_monad.default.md)<`T`\>

Returns a Maybe of the first element in the sequence

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Inherited from

List.first

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:59

___

### isEmpty

• `get` **isEmpty**(): `boolean`

Dict is empty if it has zero keys

#### Returns

`boolean`

#### Overrides

List.isEmpty

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:76

___

### keys

• `get` **keys**(): [`default`](primitive_list_monad.default.md)<`K`\>

#### Returns

[`default`](primitive_list_monad.default.md)<`K`\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:57

___

### last

• `get` **last**(): [`default`](primitive_maybe_monad.default.md)<`T`\>

Returns a Maybe of the last element in the sequence

#### Returns

[`default`](primitive_maybe_monad.default.md)<`T`\>

#### Inherited from

List.last

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:92

___

### length

• `get` **length**(): [`default`](primitive_num_monad.default.md)

#### Returns

[`default`](primitive_num_monad.default.md)

#### Inherited from

List.length

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:52

___

### values

• `get` **values**(): [`default`](primitive_list_monad.default.md)<`V`\>

#### Returns

[`default`](primitive_list_monad.default.md)<`V`\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:65

## Methods

### assign

▸ **assign**<`O`\>(`other`): [`default`](primitive_dict_monad.default.md)<`T` & `O`, `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"key"``], `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"value"``]\>

Shallow merge of two Dicts (equivalent of Object.assign)
```ts
const foo = Dict.from({foo: true, baz: {key1: 'foo'}});
const bar = Dict.from({bar: 1, baz: {key2: 'bar'}});
const fooBar = foo.assign(bar);
fooBar.toObject() // {foo: true, bar: 1, baz: {key2: 'bar'}}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T` & `O`, `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"key"``], `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"value"``]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:237

___

### compact

▸ **compact**<`R`\>(): [`default`](primitive_list_monad.default.md)<`R`\>

Remove all null, undefined, None, or Nil values (shallow)
```ts
const listOfEmpties = List.from([[], 'foo', null, None])
const compacted = listOfEmpties.compact()
compacted.toArray() // [[], 'foo']
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `R` | extends `Map`<`K`, `V`, `R`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<`R`\>

#### Inherited from

[default](primitive_list_monad.default.md).[compact](primitive_list_monad.default.md#compact)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:198

___

### concat

▸ **concat**<`O`\>(`other`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends [`default`](primitive_str_monad.default.md)<`any`, `O`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `O`\>

#### Inherited from

[default](primitive_list_monad.default.md).[concat](primitive_list_monad.default.md#concat)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:282

▸ **concat**<`O`\>(`other`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `O`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends `string` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `O`\>

#### Inherited from

[default](primitive_list_monad.default.md).[concat](primitive_list_monad.default.md#concat)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:284

▸ **concat**<`O`, `I`\>(`other`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `I`\>

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

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\> \| `I`\>

#### Inherited from

[default](primitive_list_monad.default.md).[concat](primitive_list_monad.default.md#concat)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:286

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

[default](primitive_list_monad.default.md).[equals](primitive_list_monad.default.md#equals)

#### Defined in

packages/types/src/monads/monad.ts:139

___

### filter

▸ **filter**(`predicate`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`val`: `RawDict`<`K`, `V`\>) => `boolean` |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[filter](primitive_list_monad.default.md#filter)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:180

___

### find

▸ **find**(`predicate`): [`default`](primitive_maybe_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate` | (`val`: `RawDict`<`K`, `V`\>) => `boolean` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[find](primitive_list_monad.default.md#find)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:167

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
| `project` | (`value`: `Iterable`<`RawDict`<`K`, `V`\>\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](primitive_list_monad.default.md).[flatMap](primitive_list_monad.default.md#flatmap)

#### Defined in

packages/types/src/monads/monad.ts:180

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
| `R` | `RawDict`<`K`, `V`\> |

#### Returns

[`default`](primitive_list_monad.default.md)<`R`\>

#### Inherited from

[default](primitive_list_monad.default.md).[flatten](primitive_list_monad.default.md#flatten)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:308

___

### forEach

▸ **forEach**(`project`): [`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

Iterate over each item in the List, without modifying value

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `project` | (`val`: `RawDict`<`K`, `V`\>) => `void` | callback invoked for each item ```ts const start = List.from([1,2,3]) const end = start.forEach((v) => v+1); end.toArray() // [1,2,3] ``` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

#### Inherited from

[default](primitive_list_monad.default.md).[forEach](primitive_list_monad.default.md#foreach)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:239

___

### get

▸ **get**(): `Iterable`<`RawDict`<`K`, `V`\>\>

Get raw value of monad

#### Returns

`Iterable`<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[get](primitive_list_monad.default.md#get)

#### Defined in

packages/types/src/monads/monad.ts:114

___

### getKey

▸ **getKey**(`index`): [`default`](primitive_maybe_monad.default.md)<`K`\>

Gets key at index

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`K`\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:140

___

### getOrElse

▸ **getOrElse**(`other`): `Iterable`<`RawDict`<`K`, `V`\>\>

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
| `other` | `Iterable`<`RawDict`<`K`, `V`\>\> \| () => `Iterable`<`RawDict`<`K`, `V`\>\> |

#### Returns

`Iterable`<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[getOrElse](primitive_list_monad.default.md#getorelse)

#### Defined in

packages/types/src/monads/monad.ts:128

___

### getValue

▸ **getValue**<`O`, `R`\>(`key`): [`default`](primitive_maybe_monad.default.md)<`R`\>

Gets value of named key

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends `string` = `K` |
| `R` | `KeyVal`<`T`, `O`\>[``"value"``] |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `O` |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`R`\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:157

___

### hasIndex

▸ **hasIndex**(`index`): `boolean`

Checks if a key exists and a given index

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Overrides

[default](primitive_list_monad.default.md).[hasIndex](primitive_list_monad.default.md#hasindex)

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:131

___

### hasKey

▸ **hasKey**(`key`): `boolean`

Checks if named key exists

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:149

___

### includes

▸ **includes**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `RawDict`<`K`, `V`\> |

#### Returns

`boolean`

#### Inherited from

[default](primitive_list_monad.default.md).[includes](primitive_list_monad.default.md#includes)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:173

___

### indexOf

▸ **indexOf**(`val`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `RawDict`<`K`, `V`\> |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Inherited from

[default](primitive_list_monad.default.md).[indexOf](primitive_list_monad.default.md#indexof)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:245

___

### isThis

▸ **isThis**(`val?`): val is default<T, K, V\>

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

val is default<T, K, V\>

#### Inherited from

[default](primitive_list_monad.default.md).[isThis](primitive_list_monad.default.md#isthis)

#### Defined in

packages/types/src/monads/monad.ts:57

___

### join

▸ **join**(`separator?`): [`default`](primitive_str_monad.default.md)<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `separator?` | `string` \| [`default`](primitive_str_monad.default.md)<`string`\> |

#### Returns

[`default`](primitive_str_monad.default.md)<`string`\>

#### Inherited from

[default](primitive_list_monad.default.md).[join](primitive_list_monad.default.md#join)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:316

___

### map

▸ **map**(`project`): [`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `Iterable`<`RawDict`<`K`, `V`\>\>) => `Iterable`<`RawDict`<`K`, `V`\>\> |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

#### Inherited from

[default](primitive_list_monad.default.md).[map](primitive_list_monad.default.md#map)

#### Defined in

packages/types/src/monads/monad.ts:165

___

### mapEach

▸ **mapEach**<`M`\>(`project`): [`default`](primitive_list_monad.default.md)<`M`\>

Map over each item in the List, modifying each value

#### Type parameters

| Name | Type |
| :------ | :------ |
| `M` | `RawDict`<`K`, `V`\> |

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `project` | (`val`: `RawDict`<`K`, `V`\>) => `M` | callback invoked for each item ```ts const start = List.from([1,2,3]) const end = start.mapEach((v) => v+1); end.toArray() // [2,3,4] ``` |

#### Returns

[`default`](primitive_list_monad.default.md)<`M`\>

#### Inherited from

[default](primitive_list_monad.default.md).[mapEach](primitive_list_monad.default.md#mapeach)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:226

___

### merge

▸ **merge**<`O`\>(`other`): [`default`](primitive_dict_monad.default.md)<`T` & `O`, `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"key"``], `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"value"``]\>

Recursive merge of two Dicts
```ts
const foo = Dict.from({foo: true, baz: {key1: 'foo'}});
const bar = Dict.from({bar: 1, baz: {key2: 'bar'}});
const fooBar = foo.merge(bar);
fooBar.toObject() // {foo: true, bar: 1, baz: {key1: 'foo', key2: 'bar'}}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | extends `object` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `O` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T` & `O`, `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"key"``], `KeyVal`<`T` & `O`, keyof `T` \| keyof `O`\>[``"value"``]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:220

___

### nth

▸ **nth**(`index`): [`default`](primitive_maybe_monad.default.md)<`RawDict`<`K`, `V`\>\>

Returns a Maybe of the nth element in the sequence

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_maybe_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[nth](primitive_list_monad.default.md#nth)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:74

___

### omit

▸ **omit**<`K2`, `R`\>(...`other`): [`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

Omits one or more keys from the Dict
```ts
const fooBar = Dict.from({foo: true, bar: 1});
const foo = fooBar.omit('bar');
foo.toObject() // {foo: true}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K2` | `K` |
| `R` | `T` extends `object` ? `Omit`<`T`, `K2`\> : `never` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...other` | `K2`[] |

#### Returns

[`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:201

▸ **omit**<`K2`, `R`\>(...`other`): `R`

Omits one or more keys from the Dict
```ts
const fooBar = Dict.from({foo: true, bar: 1});
const foo = fooBar.omit('bar');
foo.toObject() // {foo: true}
```

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K2` | extends `unknown` |
| `R` | [`default`](primitive_dict_monad.default.md)<`T`, `Exclude`<`K`, `K2`\>, `V`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `...other` | `K2`[] |

#### Returns

`R`

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:203

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
| `cb` | (`agg`: `R`, `next`: `RawDict`<`K`, `V`\>, `index`: `number`) => `R` |
| `seed` | `R` |

#### Returns

`R`

#### Inherited from

[default](primitive_list_monad.default.md).[reduce](primitive_list_monad.default.md#reduce)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:205

___

### setValue

▸ **setValue**<`O`\>(`key`, `val`): [`default`](primitive_dict_monad.default.md)<`T`, `KeyVal`<`T`, keyof `T`\>[``"key"``], `KeyVal`<`T`, keyof `T`\>[``"value"``]\>

Sets value of named key

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | `K` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `O` |
| `val` | `V` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T`, `KeyVal`<`T`, keyof `T`\>[``"key"``], `KeyVal`<`T`, keyof `T`\>[``"value"``]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:166

___

### slice

▸ **slice**(`from`, `to?`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `from` | `number` \| [`default`](primitive_num_monad.default.md) |
| `to?` | `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[slice](primitive_list_monad.default.md#slice)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:260

___

### sort

▸ **sort**(`compareFn?`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `compareFn?` | (`a`: `RawDict`<`K`, `V`\>, `b`: `RawDict`<`K`, `V`\>) => `number` |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[sort](primitive_list_monad.default.md#sort)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:312

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
| `project` | (`value`: [`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>) => `M` |

#### Returns

`M`

#### Inherited from

[default](primitive_list_monad.default.md).[switchMap](primitive_list_monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `Iterable`<`RawDict`<`K`, `V`\>\>) => `void` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

#### Inherited from

[default](primitive_list_monad.default.md).[tap](primitive_list_monad.default.md#tap)

#### Defined in

packages/types/src/monads/monad.ts:152

___

### toArray

▸ **toArray**(): `RawDict`<`K`, `V`\>[]

#### Returns

`RawDict`<`K`, `V`\>[]

#### Inherited from

[default](primitive_list_monad.default.md).[toArray](primitive_list_monad.default.md#toarray)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:334

___

### toJSON

▸ **toJSON**(): `any`

When calling `.toJSON()`

#### Returns

`any`

#### Overrides

[default](primitive_list_monad.default.md).[toJSON](primitive_list_monad.default.md#tojson)

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:264

___

### toList

▸ **toList**(): [`default`](primitive_list_monad.default.md)<[`K`, `V`]\>

Converts Dict to List
```ts
const fooBar = Dict.from({foo: true, bar: 1});
fooBar.toList().toArray() // [["foo", true], ["bar", 1]]
```

#### Returns

[`default`](primitive_list_monad.default.md)<[`K`, `V`]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:260

___

### toObject

▸ **toObject**<`O`, `R`\>(): `R`

Converts original value to it's Object representation

#### Type parameters

| Name | Type |
| :------ | :------ |
| `O` | `T` |
| `R` | `O` extends `IAsObject`<`T`\> ? `O` : `never` |

#### Returns

`R`

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:180

___

### toString

▸ **toString**(): `string`

When calling `.toString()`

#### Returns

`string`

#### Overrides

[default](primitive_list_monad.default.md).[toString](primitive_list_monad.default.md#tostring)

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:171

___

### unique

▸ **unique**(`predicate?`): [`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `predicate?` | (`val`: `RawDict`<`K`, `V`\>) => `any` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`T`, `K`, `V`\>

#### Inherited from

[default](primitive_list_monad.default.md).[unique](primitive_list_monad.default.md#unique)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:320

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
| `R` | `RawDict`<`K`, `V`\> |

#### Returns

`Promise`<[`default`](primitive_list_monad.default.md)<`R`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[unwindPromises](primitive_list_monad.default.md#unwindpromises)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:347

___

### valueOf

▸ **valueOf**(): `Iterable`<`RawDict`<`K`, `V`\>\>

When calling `.valueOf()`

#### Returns

`Iterable`<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[valueOf](primitive_list_monad.default.md#valueof)

#### Defined in

packages/types/src/monads/monad.ts:212

___

### without

▸ **without**(...`other`): [`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `...other` | `RawDict`<`K`, `V`\>[] |

#### Returns

[`default`](primitive_list_monad.default.md)<`RawDict`<`K`, `V`\>\>

#### Inherited from

[default](primitive_list_monad.default.md).[without](primitive_list_monad.default.md#without)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:186

___

### from

▸ `Static` **from**<`D`, `R`\>(`val?`): [`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

Coerces any value to a Dict, if not one already

**`See`**

Dict.of

#### Type parameters

| Name | Type |
| :------ | :------ |
| `D` | extends `object` |
| `R` | `D` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `D` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

#### Overrides

[default](primitive_list_monad.default.md).[from](primitive_list_monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:119

▸ `Static` **from**<`D`, `R`\>(`val?`): [`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `D` | extends `Map`<`any`, `any`, `D`\> |
| `R` | `Map`<`KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `D` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`R`, `KeyVal`<`R`, keyof `R`\>[``"key"``], `KeyVal`<`R`, keyof `R`\>[``"value"``]\>

#### Overrides

List.from

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:120

▸ `Static` **from**<`D`\>(`val?`): [`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `D` | extends `Iterable`<[`any`, `any`], `D`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `D` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

#### Overrides

List.from

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:121

▸ `Static` **from**<`D`\>(`val?`): [`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `D` | extends [`default`](primitive_list_monad.default.md)<[`any`, `any`], `D`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `D` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

#### Overrides

List.from

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:122

___

### isDict

▸ `Static` **isDict**<`D`\>(`val`): val is default<D, KeyVal<D, keyof D\>["key"], KeyVal<D, keyof D\>["value"]\>

Indicates if passed value is an instance of `Dict`
```ts
if (Dict.isDict(val)) {
    // is a Dict
}
```

#### Type parameters

| Name |
| :------ |
| `D` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<D, KeyVal<D, keyof D\>["key"], KeyVal<D, keyof D\>["value"]\>

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:88

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

#### Inherited from

[default](primitive_list_monad.default.md).[isList](primitive_list_monad.default.md#islist)

#### Defined in

packages/types/src/monads/primitive/list.monad.ts:112

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

[default](primitive_list_monad.default.md).[isMonad](primitive_list_monad.default.md#ismonad)

#### Defined in

packages/types/src/monads/monad.ts:76

___

### of

▸ `Static` **of**<`D`\>(`val`): [`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

Returns a Dict representing the passed value as a Map.

```ts
const empty = Dict.of([]);
empty.get() // Map<never, never>

const arr = Dict.of([['foo', 'bar']);
arr.get() // Map<string, string>

const list = Dict.of(List.of([['foo', 'bar']));
list.get() // Map<string, string>
```

#### Type parameters

| Name |
| :------ |
| `D` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `D` |

#### Returns

[`default`](primitive_dict_monad.default.md)<`D`, `KeyVal`<`D`, keyof `D`\>[``"key"``], `KeyVal`<`D`, keyof `D`\>[``"value"``]\>

#### Overrides

[default](primitive_list_monad.default.md).[of](primitive_list_monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/dict.monad.ts:106
