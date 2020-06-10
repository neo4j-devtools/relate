[@relate/types](../README.md) › [List](list.md)

# Class: List ‹**T**›

**`description`** 
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

▪ **T**

## Hierarchy

* [Monad](monad.md)‹Iterable‹T››

  ↳ **List**

  ↳ [Dict](dict.md)

## Implements

* [IMonad](../interfaces/imonad.md)‹Iterable‹T››

## Index

### Accessors

* [first](list.md#first)
* [isEmpty](list.md#isempty)
* [last](list.md#last)
* [length](list.md#length)

### Methods

* [compact](list.md#compact)
* [concat](list.md#concat)
* [filter](list.md#filter)
* [find](list.md#find)
* [flatten](list.md#flatten)
* [forEach](list.md#foreach)
* [hasIndex](list.md#hasindex)
* [includes](list.md#includes)
* [indexOf](list.md#indexof)
* [join](list.md#join)
* [mapEach](list.md#mapeach)
* [nth](list.md#nth)
* [reduce](list.md#reduce)
* [slice](list.md#slice)
* [sort](list.md#sort)
* [toArray](list.md#toarray)
* [toString](list.md#tostring)
* [unwindPromises](list.md#unwindpromises)
* [from](list.md#static-from)
* [isList](list.md#static-islist)
* [of](list.md#static-of)

## Accessors

###  first

• **get first**(): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:70](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L70)*

Returns a [Maybe](maybe.md) of the first element in the sequence

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

*Defined in [src/monads/primitive/list.monad.ts:59](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L59)*

List are empty if length is zero

**Returns:** *boolean*

___

###  last

• **get last**(): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:103](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L103)*

Returns a [Maybe](maybe.md) of the last element in the sequence

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  length

• **get length**(): *[Num](num.md)*

*Defined in [src/monads/primitive/list.monad.ts:63](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L63)*

**Returns:** *[Num](num.md)*

## Methods

###  compact

▸ **compact**‹**R**›(): *[List](list.md)‹R›*

*Defined in [src/monads/primitive/list.monad.ts:205](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L205)*

Remove all null, undefined, None, or Nil values (shallow)
```ts
const listOfEmpties = List.from([[], 'foo', null, None])
const compacted = listOfEmpties.compact()
compacted.toArray() // [[], 'foo']
```

**Type parameters:**

▪ **R**

**Returns:** *[List](list.md)‹R›*

___

###  concat

▸ **concat**‹**O**›(`other`: O): *[List](list.md)‹T | O›*

*Defined in [src/monads/primitive/list.monad.ts:289](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L289)*

**Type parameters:**

▪ **O**: *[Str](str.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[List](list.md)‹T | O›*

▸ **concat**‹**O**›(`other`: O): *[List](list.md)‹T | O›*

*Defined in [src/monads/primitive/list.monad.ts:291](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L291)*

**Type parameters:**

▪ **O**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[List](list.md)‹T | O›*

▸ **concat**‹**O**, **I**›(`other`: O): *[List](list.md)‹T | I›*

*Defined in [src/monads/primitive/list.monad.ts:293](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L293)*

**Type parameters:**

▪ **O**

▪ **I**

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[List](list.md)‹T | I›*

___

###  filter

▸ **filter**(`predicate`: function): *[List](list.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:191](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L191)*

**Parameters:**

▪ **predicate**: *function*

▸ (`val`: T): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[List](list.md)‹T›*

___

###  find

▸ **find**(`predicate`: function): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:178](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L178)*

**Parameters:**

▪ **predicate**: *function*

▸ (`val`: T): *boolean*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  flatten

▸ **flatten**‹**R**›(): *[List](list.md)‹R›*

*Defined in [src/monads/primitive/list.monad.ts:316](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L316)*

Flattens all iterable items (shallow)
```ts
const listOfLists = List.from([[], 'foo', [2], List.from(true)])
const flat = listOfLists.flatten()
flat.toArray() // ['f', 'o', 'o', 2, true]
```

**Type parameters:**

▪ **R**

**Returns:** *[List](list.md)‹R›*

___

###  forEach

▸ **forEach**(`project`: function): *this*

*Defined in [src/monads/primitive/list.monad.ts:246](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L246)*

Iterate over each item in the List, without modifying value

**Parameters:**

▪ **project**: *function*

callback invoked for each item
```ts
const start = List.from([1,2,3])
const end = start.forEach((v) => v+1);
end.toArray() // [1,2,3]
```

▸ (`val`: T): *void*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *this*

___

###  hasIndex

▸ **hasIndex**(`index`: [Num](num.md) | number): *boolean*

*Defined in [src/monads/primitive/list.monad.ts:172](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L172)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | [Num](num.md) &#124; number |

**Returns:** *boolean*

___

###  includes

▸ **includes**(`other`: T): *boolean*

*Defined in [src/monads/primitive/list.monad.ts:184](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L184)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | T |

**Returns:** *boolean*

___

###  indexOf

▸ **indexOf**(`val`: T): *[Num](num.md)*

*Defined in [src/monads/primitive/list.monad.ts:252](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L252)*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Num](num.md)*

___

###  join

▸ **join**(`separator?`: string | [Str](str.md)): *[Str](str.md)*

*Defined in [src/monads/primitive/list.monad.ts:324](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L324)*

**Parameters:**

Name | Type |
------ | ------ |
`separator?` | string &#124; [Str](str.md) |

**Returns:** *[Str](str.md)*

___

###  mapEach

▸ **mapEach**‹**M**›(`project`: function): *[List](list.md)‹M›*

*Defined in [src/monads/primitive/list.monad.ts:233](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L233)*

Map over each item in the List, modifying each value

**Type parameters:**

▪ **M**

**Parameters:**

▪ **project**: *function*

callback invoked for each item
```ts
const start = List.from([1,2,3])
const end = start.mapEach((v) => v+1);
end.toArray() // [2,3,4]
```

▸ (`val`: T): *M*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[List](list.md)‹M›*

___

###  nth

▸ **nth**(`index`: number | string | [Num](num.md)): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:85](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L85)*

Returns a [Maybe](maybe.md) of the nth element in the sequence

**Parameters:**

Name | Type |
------ | ------ |
`index` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  reduce

▸ **reduce**‹**R**›(`cb`: function, `seed`: R): *R*

*Defined in [src/monads/primitive/list.monad.ts:212](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L212)*

**Type parameters:**

▪ **R**

**Parameters:**

▪ **cb**: *function*

▸ (`agg`: R, `next`: T, `index`: number): *R*

**Parameters:**

Name | Type |
------ | ------ |
`agg` | R |
`next` | T |
`index` | number |

▪ **seed**: *R*

**Returns:** *R*

___

###  slice

▸ **slice**(`from`: [Num](num.md) | number, `to?`: [Num](num.md) | number): *[List](list.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:267](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L267)*

**Parameters:**

Name | Type |
------ | ------ |
`from` | [Num](num.md) &#124; number |
`to?` | [Num](num.md) &#124; number |

**Returns:** *[List](list.md)‹T›*

___

###  sort

▸ **sort**(`compareFn?`: undefined | function): *[List](list.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:320](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L320)*

**Parameters:**

Name | Type |
------ | ------ |
`compareFn?` | undefined &#124; function |

**Returns:** *[List](list.md)‹T›*

___

###  toArray

▸ **toArray**(): *T[]*

*Defined in [src/monads/primitive/list.monad.ts:332](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L332)*

**Returns:** *T[]*

___

###  toString

▸ **toString**(): *string*

*Overrides [Monad](monad.md).[toString](monad.md#tostring)*

*Defined in [src/monads/primitive/list.monad.ts:328](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L328)*

**Returns:** *string*

___

###  unwindPromises

▸ **unwindPromises**‹**R**›(): *Promise‹[List](list.md)‹R››*

*Defined in [src/monads/primitive/list.monad.ts:345](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L345)*

Unwinds any promises in list (shallow), using Promise.all()

```ts
const listOfPromises = List.from(['foo', Promise.resolve(2), Promise.resolve([])])
const unwound = await listOfPromises.unwindPromises()
unwound.toArray() // ['foo', 2, []]
```

**Type parameters:**

▪ **R**

**Returns:** *Promise‹[List](list.md)‹R››*

___

### `Static` from

▸ **from**‹**T**›(`val?`: Iterable‹T› | null): *[List](list.md)‹T›*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

*Defined in [src/monads/primitive/list.monad.ts:154](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L154)*

Coerces any value to a List, if not one already

**`see`** [List.of](list.md#static-of)

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val?` | Iterable‹T› &#124; null |

**Returns:** *[List](list.md)‹T›*

___

### `Static` isList

▸ **isList**‹**T**›(`val`: any): *val is List<T>*

*Defined in [src/monads/primitive/list.monad.ts:123](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L123)*

Indicates if passed value is an instance of `List`
```ts
if (List.isList(val)) {
    // is a List
}
```

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is List<T>*

___

### `Static` of

▸ **of**‹**T**›(`val`: Iterable‹T›): *[List](list.md)‹T›*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

*Defined in [src/monads/primitive/list.monad.ts:144](https://github.com/neo-technology/relate/blob/8cad01f/packages/types/src/monads/primitive/list.monad.ts#L144)*

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

**Type parameters:**

▪ **T**

**Parameters:**

Name | Type |
------ | ------ |
`val` | Iterable‹T› |

**Returns:** *[List](list.md)‹T›*
