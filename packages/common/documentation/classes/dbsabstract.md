[@relate/common](../README.md) › [DbsAbstract](dbsabstract.md)

# Class: DbsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbsAbstract**

## Index

### Constructors

* [constructor](dbsabstract.md#constructor)

### Methods

* [create](dbsabstract.md#abstract-create)
* [drop](dbsabstract.md#abstract-drop)
* [dump](dbsabstract.md#abstract-dump)
* [exec](dbsabstract.md#abstract-exec)
* [list](dbsabstract.md#abstract-list)
* [load](dbsabstract.md#abstract-load)

## Constructors

###  constructor

\+ **new DbsAbstract**(`environment`: Env): *[DbsAbstract](dbsabstract.md)*

*Defined in [dbs/dbs.abstract.ts:8](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | Env |

**Returns:** *[DbsAbstract](dbsabstract.md)*

## Methods

### `Abstract` create

▸ **create**(`dbmsId`: string, `user`: string, `dbName`: string, `accessToken`: string): *Promise‹void›*

*Defined in [dbs/dbs.abstract.ts:11](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`user` | string |
`dbName` | string |
`accessToken` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` drop

▸ **drop**(`dbmsId`: string, `user`: string, `dbName`: string, `accessToken`: string): *Promise‹void›*

*Defined in [dbs/dbs.abstract.ts:13](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`user` | string |
`dbName` | string |
`accessToken` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` dump

▸ **dump**(`dbmsId`: string, `database`: string, `to`: string, `javaPath?`: undefined | string): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:17](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`database` | string |
`to` | string |
`javaPath?` | undefined &#124; string |

**Returns:** *Promise‹string›*

___

### `Abstract` exec

▸ **exec**(`dbmsId`: string, `from`: string | ReadStream, `args`: object): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:21](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L21)*

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

*Defined in [dbs/dbs.abstract.ts:15](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`user` | string |
`accessToken` | string |

**Returns:** *Promise‹List‹IDb››*

___

### `Abstract` load

▸ **load**(`dbmsId`: string, `database`: string, `from`: string, `force?`: undefined | false | true, `javaPath?`: undefined | string): *Promise‹string›*

*Defined in [dbs/dbs.abstract.ts:19](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbs/dbs.abstract.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`database` | string |
`from` | string |
`force?` | undefined &#124; false &#124; true |
`javaPath?` | undefined &#124; string |

**Returns:** *Promise‹string›*
