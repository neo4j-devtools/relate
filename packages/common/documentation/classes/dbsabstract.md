[@relate/common](../README.md) › [DbsAbstract](dbsabstract.md)

# Class: DbsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbsAbstract**

## Index

### Methods

* [create](dbsabstract.md#abstract-create)
* [drop](dbsabstract.md#abstract-drop)
* [dump](dbsabstract.md#abstract-dump)
* [exec](dbsabstract.md#abstract-exec)
* [list](dbsabstract.md#abstract-list)
* [load](dbsabstract.md#abstract-load)

## Methods

### `Abstract` create

▸ **create**(`dbmsId`: string, `user`: string, `dbName`: string, `accessToken`: string): *Promise‹void›*

*Defined in [dbs/dbs.abstract.ts:21](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L21)*

Creates a new Database

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`user` | string | DBMS user |
`dbName` | string | Database name |
`accessToken` | string | DBMS access token  |

**Returns:** *Promise‹void›*

___

### `Abstract` drop

▸ **drop**(`dbmsId`: string, `user`: string, `dbName`: string, `accessToken`: string): *Promise‹void›*

*Defined in [dbs/dbs.abstract.ts:30](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L30)*

Drops a Database

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`user` | string | DBMS user |
`dbName` | string | Database name |
`accessToken` | string | DBMS access token  |

**Returns:** *Promise‹void›*

___

### `Abstract` dump

▸ **dump**(`dbmsId`: string, `database`: string, `to`: string, `javaPath?`: undefined | string): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:47](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L47)*

Dumps a databese contents

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`database` | string | Database to dump |
`to` | string | - |
`javaPath?` | undefined &#124; string | - |

**Returns:** *Promise‹string›*

___

### `Abstract` exec

▸ **exec**(`dbmsId`: string, `from`: string | ReadStream, `args`: object): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:64](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L64)*

Executes cypher against a given dbms

**Parameters:**

▪ **dbmsId**: *string*

▪ **from**: *string | ReadStream*

▪ **args**: *object*

Name | Type |
------ | ------ |
`accessToken` | string |
`database` | string |
`user` | string |

**Returns:** *Promise‹string›*

___

### `Abstract` list

▸ **list**(`dbmsId`: string, `user`: string, `accessToken`: string): *Promise‹List‹IDb››*

*Defined in [dbs/dbs.abstract.ts:38](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L38)*

Lists all databases

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`user` | string | DBMS user |
`accessToken` | string | DBMS access token  |

**Returns:** *Promise‹List‹IDb››*

___

### `Abstract` load

▸ **load**(`dbmsId`: string, `database`: string, `from`: string, `force?`: undefined | false | true, `javaPath?`: undefined | string): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:56](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L56)*

Loads a database dump

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`database` | string | Database to load contents into |
`from` | string | - |
`force?` | undefined &#124; false &#124; true | - |
`javaPath?` | undefined &#124; string |   |

**Returns:** *Promise‹string›*
