[@relate/common](../README.md) › [EnvironmentAbstract](environmentabstract.md)

# Class: EnvironmentAbstract

## Hierarchy

* **EnvironmentAbstract**

## Index

### Properties

* [dbmss](environmentabstract.md#readonly-dbmss)
* [dbs](environmentabstract.md#readonly-dbs)
* [extensions](environmentabstract.md#readonly-extensions)
* [projects](environmentabstract.md#readonly-projects)

### Accessors

* [httpOrigin](environmentabstract.md#httporigin)
* [id](environmentabstract.md#id)
* [isActive](environmentabstract.md#isactive)
* [isSandboxed](environmentabstract.md#issandboxed)
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

### `Readonly` dbmss

• **dbmss**: *[DbmssAbstract](dbmssabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:25](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L25)*

See [DbmssAbstract](dbmssabstract.md)

___

### `Readonly` dbs

• **dbs**: *[DbsAbstract](dbsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:30](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L30)*

See [DbsAbstract](dbsabstract.md)

___

### `Readonly` extensions

• **extensions**: *[ExtensionsAbstract](extensionsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:35](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L35)*

See [ExtensionsAbstract](extensionsabstract.md)

___

### `Readonly` projects

• **projects**: *[ProjectsAbstract](projectsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:40](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L40)*

See [ProjectsAbstract](projectsabstract.md)

## Accessors

###  httpOrigin

• **get httpOrigin**(): *string*

*Defined in [environments/environment.abstract.ts:75](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L75)*

**Returns:** *string*

___

###  id

• **get id**(): *string*

*Defined in [environments/environment.abstract.ts:49](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L49)*

**Returns:** *string*

___

###  isActive

• **get isActive**(): *boolean*

*Defined in [environments/environment.abstract.ts:60](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L60)*

Indicates if environment is current active

**Returns:** *boolean*

___

###  isSandboxed

• **get isSandboxed**(): *boolean*

*Defined in [environments/environment.abstract.ts:67](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L67)*

Indicates if environment lacks administrative privileges

**Returns:** *boolean*

___

###  name

• **get name**(): *string*

*Defined in [environments/environment.abstract.ts:53](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L53)*

**Returns:** *string*

___

###  type

• **get type**(): *ENVIRONMENT_TYPES*

*Defined in [environments/environment.abstract.ts:71](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L71)*

**Returns:** *ENVIRONMENT_TYPES*

## Methods

###  generateAuthToken

▸ **generateAuthToken**(`data`: any): *Promise‹string›*

*Defined in [environments/environment.abstract.ts:151](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L151)*

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

*Defined in [environments/environment.abstract.ts:189](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L189)*

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

*Defined in [environments/environment.abstract.ts:133](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L133)*

Environment initialisation logic

**Returns:** *Promise‹void›*

___

###  login

▸ **login**(`redirectTo?`: undefined | string): *Promise‹IEnvironmentAuth›*

*Defined in [environments/environment.abstract.ts:138](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L138)*

Environment Authentication logic

**Parameters:**

Name | Type |
------ | ------ |
`redirectTo?` | undefined &#124; string |

**Returns:** *Promise‹IEnvironmentAuth›*

___

###  reloadConfig

▸ **reloadConfig**(): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:196](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L196)*

Reloads config from disk

**Returns:** *Promise‹void›*

___

###  supports

▸ **supports**(`methodName`: string): *boolean*

*Defined in [environments/environment.abstract.ts:176](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L176)*

Checks if given GraphQL method is supported

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodName` | string |   |

**Returns:** *boolean*

___

###  updateConfig

▸ **updateConfig**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:208](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L208)*

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

*Defined in [environments/environment.abstract.ts:164](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L164)*

Verifies an authentication token

**`throws`** AuthenticationError

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`token` | string | "" | token to verify |

**Returns:** *Promise‹void›*
