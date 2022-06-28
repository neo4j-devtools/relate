[@relate/common](../README.md) › [EnvironmentAbstract](environmentabstract.md)

# Class: EnvironmentAbstract

## Hierarchy

* **EnvironmentAbstract**

## Index

### Properties

* [backups](environmentabstract.md#readonly-backups)
* [dbmsPlugins](environmentabstract.md#readonly-dbmsplugins)
* [dbmss](environmentabstract.md#readonly-dbmss)
* [dbs](environmentabstract.md#readonly-dbs)
* [extensions](environmentabstract.md#readonly-extensions)
* [projects](environmentabstract.md#readonly-projects)

### Accessors

* [httpOrigin](environmentabstract.md#httporigin)
* [id](environmentabstract.md#id)
* [isActive](environmentabstract.md#isactive)
* [name](environmentabstract.md#name)
* [requiresAPIToken](environmentabstract.md#requiresapitoken)
* [type](environmentabstract.md#type)

### Methods

* [generateAPIToken](environmentabstract.md#abstract-generateapitoken)
* [getConfigValue](environmentabstract.md#getconfigvalue)
* [init](environmentabstract.md#abstract-init)
* [reloadConfig](environmentabstract.md#reloadconfig)
* [supports](environmentabstract.md#supports)
* [updateConfig](environmentabstract.md#updateconfig)
* [verifyAPIToken](environmentabstract.md#abstract-verifyapitoken)

## Properties

### `Readonly` backups

• **backups**: *[BackupAbstract](backupabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:28](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L28)*

___

### `Readonly` dbmsPlugins

• **dbmsPlugins**: *[DbmsPluginsAbstract](dbmspluginsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:20](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L20)*

___

### `Readonly` dbmss

• **dbmss**: *[DbmssAbstract](dbmssabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:18](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L18)*

___

### `Readonly` dbs

• **dbs**: *[DbsAbstract](dbsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:22](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L22)*

___

### `Readonly` extensions

• **extensions**: *[ExtensionsAbstract](extensionsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:24](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L24)*

___

### `Readonly` projects

• **projects**: *[ProjectsAbstract](projectsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:26](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L26)*

## Accessors

###  httpOrigin

• **get httpOrigin**(): *string*

*Defined in [environments/environment.abstract.ts:54](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L54)*

**Returns:** *string*

___

###  id

• **get id**(): *string*

*Defined in [environments/environment.abstract.ts:35](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L35)*

**Returns:** *string*

___

###  isActive

• **get isActive**(): *boolean*

*Defined in [environments/environment.abstract.ts:46](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L46)*

Indicates if environment is current active

**Returns:** *boolean*

___

###  name

• **get name**(): *string*

*Defined in [environments/environment.abstract.ts:39](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L39)*

**Returns:** *string*

___

###  requiresAPIToken

• **get requiresAPIToken**(): *boolean*

*Defined in [environments/environment.abstract.ts:58](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L58)*

**Returns:** *boolean*

___

###  type

• **get type**(): *ENVIRONMENT_TYPES*

*Defined in [environments/environment.abstract.ts:50](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L50)*

**Returns:** *ENVIRONMENT_TYPES*

## Methods

### `Abstract` generateAPIToken

▸ **generateAPIToken**(`hostName`: string, `clientId`: string, `data`: any): *Promise‹string›*

*Defined in [environments/environment.abstract.ts:100](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L100)*

Generates an API token

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hostName` | string | host name of token request |
`clientId` | string | client ID of token request |
`data` | any | API token data |

**Returns:** *Promise‹string›*

token

___

###  getConfigValue

▸ **getConfigValue**‹**K**›(`key`: K): *Promise‹EnvironmentConfigModel[K]›*

*Defined in [environments/environment.abstract.ts:127](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L127)*

Gets config value for given key

**Type parameters:**

▪ **K**: *keyof EnvironmentConfigModel*

**Parameters:**

Name | Type |
------ | ------ |
`key` | K |

**Returns:** *Promise‹EnvironmentConfigModel[K]›*

___

### `Abstract` init

▸ **init**(): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:91](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L91)*

Environment initialisation logic

**Returns:** *Promise‹void›*

___

###  reloadConfig

▸ **reloadConfig**(): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:134](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L134)*

Reloads config from disk

**Returns:** *Promise‹void›*

___

###  supports

▸ **supports**(`methodName`: PUBLIC_GRAPHQL_METHODS): *boolean*

*Defined in [environments/environment.abstract.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L114)*

Checks if given GraphQL method is supported

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodName` | PUBLIC_GRAPHQL_METHODS |   |

**Returns:** *boolean*

___

###  updateConfig

▸ **updateConfig**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:146](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L146)*

Updates config on disk

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

### `Abstract` verifyAPIToken

▸ **verifyAPIToken**(`hostName`: string, `clientId`: string, `token?`: undefined | string): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:108](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L108)*

Verifies an API token

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hostName` | string | host name of token request |
`clientId` | string | client ID of token request |
`token?` | undefined &#124; string | token to verify  |

**Returns:** *Promise‹void›*
