[@relate/common](../README.md) / [dbs/dbs.abstract](../modules/dbs_dbs_abstract.md) / DbsAbstract

# Class: DbsAbstract<Env\>

[dbs/dbs.abstract](../modules/dbs_dbs_abstract.md).DbsAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Methods

- [create](dbs_dbs_abstract.DbsAbstract.md#create)
- [drop](dbs_dbs_abstract.DbsAbstract.md#drop)
- [dump](dbs_dbs_abstract.DbsAbstract.md#dump)
- [exec](dbs_dbs_abstract.DbsAbstract.md#exec)
- [list](dbs_dbs_abstract.DbsAbstract.md#list)
- [load](dbs_dbs_abstract.DbsAbstract.md#load)

## Methods

### create

▸ `Abstract` **create**(`dbmsId`, `user`, `dbName`, `accessToken`): `Promise`<`void`\>

Creates a new Database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsId` | `string` |  |
| `user` | `string` | DBMS user |
| `dbName` | `string` | Database name |
| `accessToken` | `string` | DBMS access token |

#### Returns

`Promise`<`void`\>

#### Defined in

dbs/dbs.abstract.ts:21

___

### drop

▸ `Abstract` **drop**(`dbmsId`, `user`, `dbName`, `accessToken`): `Promise`<`void`\>

Drops a Database

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsId` | `string` |  |
| `user` | `string` | DBMS user |
| `dbName` | `string` | Database name |
| `accessToken` | `string` | DBMS access token |

#### Returns

`Promise`<`void`\>

#### Defined in

dbs/dbs.abstract.ts:30

___

### dump

▸ `Abstract` **dump**(`dbmsId`, `database`, `to`, `javaPath?`): `Promise`<`string`\>

Dumps a databese contents

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsId` | `string` |  |
| `database` | `string` | Database to dump |
| `to` | `string` | - |
| `javaPath?` | `string` | - |

#### Returns

`Promise`<`string`\>

#### Defined in

dbs/dbs.abstract.ts:47

___

### exec

▸ `Abstract` **exec**(`dbmsId`, `from`, `args`): `Promise`<`string`\>

Executes cypher against a given dbms

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsId` | `string` |
| `from` | `string` \| `ReadStream` |
| `args` | `Object` |
| `args.accessToken` | `string` |
| `args.database` | `string` |
| `args.user` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

dbs/dbs.abstract.ts:64

___

### list

▸ `Abstract` **list**(`dbmsId`, `user`, `accessToken`): `Promise`<`default`<`IDb`\>\>

Lists all databases

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsId` | `string` |  |
| `user` | `string` | DBMS user |
| `accessToken` | `string` | DBMS access token |

#### Returns

`Promise`<`default`<`IDb`\>\>

#### Defined in

dbs/dbs.abstract.ts:38

___

### load

▸ `Abstract` **load**(`dbmsId`, `database`, `from`, `force?`, `javaPath?`): `Promise`<`string`\>

Loads a database dump

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsId` | `string` |  |
| `database` | `string` | Database to load contents into |
| `from` | `string` | - |
| `force?` | `boolean` |  |
| `javaPath?` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

dbs/dbs.abstract.ts:56
