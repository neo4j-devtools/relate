[@relate/common](../README.md) › [EnvironmentAbstract](environmentabstract.md)

# Class: EnvironmentAbstract

## Hierarchy

* **EnvironmentAbstract**

## Index

### Properties

* [backups](environmentabstract.md#readonly-backups)
* [dbmss](environmentabstract.md#readonly-dbmss)
* [dbs](environmentabstract.md#readonly-dbs)
* [extensions](environmentabstract.md#readonly-extensions)
* [projects](environmentabstract.md#readonly-projects)

### Accessors

* [httpOrigin](environmentabstract.md#httporigin)
* [id](environmentabstract.md#id)
* [isActive](environmentabstract.md#isactive)
* [name](environmentabstract.md#name)
* [type](environmentabstract.md#type)

### Methods

* [generateAuthToken](environmentabstract.md#generateauthtoken)
* [getConfigValue](environmentabstract.md#getconfigvalue)
* [init](environmentabstract.md#abstract-init)
* [login](environmentabstract.md#login)
* [reloadConfig](environmentabstract.md#reloadconfig)
* [supports](environmentabstract.md#supports)
* [updateConfig](environmentabstract.md#updateconfig)
* [verifyAuthToken](environmentabstract.md#verifyauthtoken)

## Properties

### `Readonly` backups

• **backups**: *[BackupAbstract](backupabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:31](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L31)*

___

### `Readonly` dbmss

• **dbmss**: *[DbmssAbstract](dbmssabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:23](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L23)*

___

### `Readonly` dbs

• **dbs**: *[DbsAbstract](dbsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:25](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L25)*

___

### `Readonly` extensions

• **extensions**: *[ExtensionsAbstract](extensionsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:27](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L27)*

___

### `Readonly` projects

• **projects**: *[ProjectsAbstract](projectsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:29](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L29)*

## Accessors

###  httpOrigin

• **get httpOrigin**(): *string*

*Defined in [environments/environment.abstract.ts:59](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L59)*

**Returns:** *string*

___

###  id

• **get id**(): *string*

*Defined in [environments/environment.abstract.ts:40](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L40)*

**Returns:** *string*

___

###  isActive

• **get isActive**(): *boolean*

*Defined in [environments/environment.abstract.ts:51](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L51)*

Indicates if environment is current active

**Returns:** *boolean*

___

###  name

• **get name**(): *string*

*Defined in [environments/environment.abstract.ts:44](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L44)*

**Returns:** *string*

___

###  type

• **get type**(): *ENVIRONMENT_TYPES*

*Defined in [environments/environment.abstract.ts:55](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L55)*

**Returns:** *ENVIRONMENT_TYPES*

## Methods

###  generateAuthToken

▸ **generateAuthToken**(`data`: any): *Promise‹string›*

*Defined in [environments/environment.abstract.ts:141](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L141)*

Generates an authentication token

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`data` | any | authentication response data |

**Returns:** *Promise‹string›*

token

___

###  getConfigValue

▸ **getConfigValue**‹**K**›(`key`: K): *Promise‹EnvironmentConfigModel[K]›*

*Defined in [environments/environment.abstract.ts:179](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L179)*

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

*Defined in [environments/environment.abstract.ts:123](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L123)*

Environment initialisation logic

**Returns:** *Promise‹void›*

___

###  login

▸ **login**(`redirectTo?`: undefined | string): *Promise‹IEnvironmentAuth›*

*Defined in [environments/environment.abstract.ts:128](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L128)*

Environment Authentication logic

**Parameters:**

Name | Type |
------ | ------ |
`redirectTo?` | undefined &#124; string |

**Returns:** *Promise‹IEnvironmentAuth›*

___

###  reloadConfig

▸ **reloadConfig**(): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:186](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L186)*

Reloads config from disk

**Returns:** *Promise‹void›*

___

###  supports

▸ **supports**(`methodName`: string): *boolean*

*Defined in [environments/environment.abstract.ts:166](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L166)*

Checks if given GraphQL method is supported

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodName` | string |   |

**Returns:** *boolean*

___

###  updateConfig

▸ **updateConfig**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:198](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L198)*

Updates config on disk

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  verifyAuthToken

▸ **verifyAuthToken**(`token`: string): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:154](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L154)*

Verifies an authentication token

**`throws`** AuthenticationError

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`token` | string | "" | token to verify |

**Returns:** *Promise‹void›*
