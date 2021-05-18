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
* [unique](list.md#unique)
* [unwindPromises](list.md#unwindpromises)
* [without](list.md#without)
* [from](list.md#static-from)
* [isList](list.md#static-islist)
* [of](list.md#static-of)

## Accessors

###  first

• **get first**(): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:60](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L60)*

Returns a [Maybe](maybe.md) of the first element in the sequence

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

*Defined in [src/monads/primitive/list.monad.ts:49](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L49)*

List are empty if length is zero

**Returns:** *boolean*

___

###  last

• **get last**(): *[Maybe](maybe.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:93](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L93)*

Returns a [Maybe](maybe.md) of the last element in the sequence

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  length

• **get length**(): *[Num](num.md)*

*Defined in [src/monads/primitive/list.monad.ts:53](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L53)*

**Returns:** *[Num](num.md)*

## Methods

###  compact

▸ **compact**‹**R**›(): *[List](list.md)‹R›*

*Defined in [src/monads/primitive/list.monad.ts:199](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L199)*

Remove all null, undefined, None, or Nil values (shallow)
```ts
const listOfEmpties = List.from([[], 'foo', null, None])
const compacted = listOfEmpties.compact()
compacted.toArray() // [[], 'foo']
```

**Type parameters:**

▪ **R**: *Exclude‹T, null | undefined | [None](none.md)‹any› | [Nil](nil.md)›*

**Returns:** *[List](list.md)‹R›*

___

###  concat

▸ **concat**‹**O**›(`other`: O): *[List](list.md)‹T | O›*

*Defined in [src/monads/primitive/list.monad.ts:283](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L283)*

**Type parameters:**

▪ **O**: *[Str](str.md)‹any›*

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[List](list.md)‹T | O›*

▸ **concat**‹**O**›(`other`: O): *[List](list.md)‹T | O›*

*Defined in [src/monads/primitive/list.monad.ts:285](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L285)*

**Type parameters:**

▪ **O**: *string*

**Parameters:**

Name | Type |
------ | ------ |
`other` | O |

**Returns:** *[List](list.md)‹T | O›*

▸ **concat**‹**O**, **I**›(`other`: O): *[List](list.md)‹T | I›*

*Defined in [src/monads/primitive/list.monad.ts:287](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L287)*

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

*Defined in [src/monads/primitive/list.monad.ts:181](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L181)*

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

*Defined in [src/monads/primitive/list.monad.ts:168](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L168)*

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

*Defined in [src/monads/primitive/list.monad.ts:309](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L309)*

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

*Defined in [src/monads/primitive/list.monad.ts:240](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L240)*

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

*Defined in [src/monads/primitive/list.monad.ts:162](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L162)*

**Parameters:**

Name | Type |
------ | ------ |
`index` | [Num](num.md) &#124; number |

**Returns:** *boolean*

___

###  includes

▸ **includes**(`other`: T): *boolean*

*Defined in [src/monads/primitive/list.monad.ts:174](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L174)*

**Parameters:**

Name | Type |
------ | ------ |
`other` | T |

**Returns:** *boolean*

___

###  indexOf

▸ **indexOf**(`val`: T): *[Num](num.md)*

*Defined in [src/monads/primitive/list.monad.ts:246](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L246)*

**Parameters:**

Name | Type |
------ | ------ |
`val` | T |

**Returns:** *[Num](num.md)*

___

###  join

▸ **join**(`separator?`: string | [Str](str.md)): *[Str](str.md)*

*Defined in [src/monads/primitive/list.monad.ts:317](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L317)*

**Parameters:**

Name | Type |
------ | ------ |
`separator?` | string &#124; [Str](str.md) |

**Returns:** *[Str](str.md)*

___

###  mapEach

▸ **mapEach**‹**M**›(`project`: function): *[List](list.md)‹M›*

*Defined in [src/monads/primitive/list.monad.ts:227](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L227)*

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

*Defined in [src/monads/primitive/list.monad.ts:75](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L75)*

Returns a [Maybe](maybe.md) of the nth element in the sequence

**Parameters:**

Name | Type |
------ | ------ |
`index` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Maybe](maybe.md)‹T›*

___

###  reduce

▸ **reduce**‹**R**›(`cb`: function, `seed`: R): *R*

*Defined in [src/monads/primitive/list.monad.ts:206](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L206)*

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

*Defined in [src/monads/primitive/list.monad.ts:261](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L261)*

**Parameters:**

Name | Type |
------ | ------ |
`from` | [Num](num.md) &#124; number |
`to?` | [Num](num.md) &#124; number |

**Returns:** *[List](list.md)‹T›*

___

###  sort

▸ **sort**(`compareFn?`: undefined | function): *[List](list.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:313](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L313)*

**Parameters:**

Name | Type |
------ | ------ |
`compareFn?` | undefined &#124; function |

**Returns:** *[List](list.md)‹T›*

___

###  toArray

▸ **toArray**(): *T[]*

*Defined in [src/monads/primitive/list.monad.ts:335](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L335)*

**Returns:** *T[]*

___

###  toString

▸ **toString**(): *string*

*Overrides [Monad](monad.md).[toString](monad.md#tostring)*

*Defined in [src/monads/primitive/list.monad.ts:331](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L331)*

**Returns:** *string*

___

###  unique

▸ **unique**(`predicate?`: undefined | function): *this*

*Defined in [src/monads/primitive/list.monad.ts:321](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L321)*

**Parameters:**

Name | Type |
------ | ------ |
`predicate?` | undefined &#124; function |

**Returns:** *this*

___

###  unwindPromises

▸ **unwindPromises**‹**R**›(): *Promise‹[List](list.md)‹R››*

*Defined in [src/monads/primitive/list.monad.ts:348](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L348)*

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

###  without

▸ **without**(...`other`: T[]): *[List](list.md)‹T›*

*Defined in [src/monads/primitive/list.monad.ts:187](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L187)*

**Parameters:**

Name | Type |
------ | ------ |
`...other` | T[] |

**Returns:** *[List](list.md)‹T›*

___

### `Static` from

▸ **from**‹**T**›(`val?`: Iterable‹T› | null): *[List](list.md)‹T›*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

*Defined in [src/monads/primitive/list.monad.ts:144](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L144)*

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

*Defined in [src/monads/primitive/list.monad.ts:113](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L113)*

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

*Defined in [src/monads/primitive/list.monad.ts:134](https://github.com/neo4j-devtools/relate/blob/master/packages/types/src/monads/primitive/list.monad.ts#L134)*

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
