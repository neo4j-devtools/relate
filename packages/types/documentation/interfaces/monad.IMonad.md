[@relate/types](../README.md) / [monad](../modules/monad.md) / IMonad

# Interface: IMonad<T\>

[monad](../modules/monad.md).IMonad

## Type parameters

| Name |
| :------ |
| `T` |

## Hierarchy

- `Iterable`<`T`\>

  ↳ **`IMonad`**

## Implemented by

- [`default`](../classes/monad.default.md)

## Table of contents

### Properties

- [isEmpty](monad.IMonad.md#isempty)

### Methods

- [[iterator]](monad.IMonad.md#[iterator])
- [equals](monad.IMonad.md#equals)
- [flatMap](monad.IMonad.md#flatmap)
- [get](monad.IMonad.md#get)
- [getOrElse](monad.IMonad.md#getorelse)
- [isThis](monad.IMonad.md#isthis)
- [map](monad.IMonad.md#map)
- [switchMap](monad.IMonad.md#switchmap)
- [tap](monad.IMonad.md#tap)
- [toString](monad.IMonad.md#tostring)

## Properties

### isEmpty

• **isEmpty**: `boolean`

#### Defined in

packages/types/src/monads/monad.ts:4

## Methods

### [iterator]

▸ **[iterator]**(): `Iterator`<`T`, `any`, `undefined`\>

#### Returns

`Iterator`<`T`, `any`, `undefined`\>

#### Inherited from

Iterable.\_\_@iterator@17

#### Defined in

node_modules/.pnpm/typescript@4.8.3/node_modules/typescript/lib/lib.es2015.iterable.d.ts:51

___

### equals

▸ **equals**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | [`IMonad`](monad.IMonad.md)<`any`\> |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/monad.ts:8

___

### flatMap

▸ **flatMap**<`M`\>(`project`): `M`

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

#### Defined in

packages/types/src/monads/monad.ts:20

___

### get

▸ **get**(): `undefined` \| `T`

#### Returns

`undefined` \| `T`

#### Defined in

packages/types/src/monads/monad.ts:10

___

### getOrElse

▸ **getOrElse**(`other`): `T`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `T` |

#### Returns

`T`

#### Defined in

packages/types/src/monads/monad.ts:12

___

### isThis

▸ **isThis**(`other?`): other is IMonad<T\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `other?` | `any` |

#### Returns

other is IMonad<T\>

#### Defined in

packages/types/src/monads/monad.ts:6

___

### map

▸ **map**(`project`): [`IMonad`](monad.IMonad.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T`) => `T` |

#### Returns

[`IMonad`](monad.IMonad.md)<`T`\>

#### Defined in

packages/types/src/monads/monad.ts:16

___

### switchMap

▸ **switchMap**<`M`\>(`project`): `M`

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: [`IMonad`](monad.IMonad.md)<`T`\>) => `M` |

#### Returns

`M`

#### Defined in

packages/types/src/monads/monad.ts:22

___

### tap

▸ **tap**(`project`): [`IMonad`](monad.IMonad.md)<`T`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `T`) => `void` |

#### Returns

[`IMonad`](monad.IMonad.md)<`T`\>

#### Defined in

packages/types/src/monads/monad.ts:18

___

### toString

▸ **toString**(`formatter?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `formatter?` | (`val`: `T`) => `string` |

#### Returns

`string`

#### Defined in

packages/types/src/monads/monad.ts:14
