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
* [requiresAPIToken](environmentabstract.md#requiresapitoken)
* [type](environmentabstract.md#type)

### Methods

* [generateAPIToken](environmentabstract.md#abstract-generateapitoken)
* [generateAuthToken](environmentabstract.md#generateauthtoken)
* [getConfigValue](environmentabstract.md#getconfigvalue)
* [init](environmentabstract.md#abstract-init)
* [login](environmentabstract.md#login)
* [reloadConfig](environmentabstract.md#reloadconfig)
* [supports](environmentabstract.md#supports)
* [updateConfig](environmentabstract.md#updateconfig)
* [verifyAPIToken](environmentabstract.md#abstract-verifyapitoken)
* [verifyAuthToken](environmentabstract.md#verifyauthtoken)

## Properties

### `Readonly` backups

• **backups**: *[BackupAbstract](backupabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

Defined in environments/environment.abstract.ts:32

___

### `Readonly` dbmss

• **dbmss**: *[DbmssAbstract](dbmssabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

Defined in environments/environment.abstract.ts:24

___

### `Readonly` dbs

• **dbs**: *[DbsAbstract](dbsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

Defined in environments/environment.abstract.ts:26

___

### `Readonly` extensions

• **extensions**: *[ExtensionsAbstract](extensionsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

Defined in environments/environment.abstract.ts:28

___

### `Readonly` projects

• **projects**: *[ProjectsAbstract](projectsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

Defined in environments/environment.abstract.ts:30

## Accessors

###  httpOrigin

• **get httpOrigin**(): *string*

Defined in environments/environment.abstract.ts:60

**Returns:** *string*

___

###  id

• **get id**(): *string*

Defined in environments/environment.abstract.ts:41

**Returns:** *string*

___

###  isActive

• **get isActive**(): *boolean*

Defined in environments/environment.abstract.ts:52

Indicates if environment is current active

**Returns:** *boolean*

___

###  name

• **get name**(): *string*

Defined in environments/environment.abstract.ts:45

**Returns:** *string*

___

###  requiresAPIToken

• **get requiresAPIToken**(): *boolean*

Defined in environments/environment.abstract.ts:64

**Returns:** *boolean*

___

###  type

• **get type**(): *ENVIRONMENT_TYPES*

Defined in environments/environment.abstract.ts:56

**Returns:** *ENVIRONMENT_TYPES*

## Methods

### `Abstract` generateAPIToken

▸ **generateAPIToken**(`hostName`: string, `clientId`: string, `data`: any): *Promise‹string›*

Defined in environments/environment.abstract.ts:137

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

###  generateAuthToken

▸ **generateAuthToken**(`data`: any): *Promise‹string›*

Defined in environments/environment.abstract.ts:163

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

Defined in environments/environment.abstract.ts:201

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

Defined in environments/environment.abstract.ts:128

Environment initialisation logic

**Returns:** *Promise‹void›*

___

###  login

▸ **login**(`redirectTo?`: undefined | string): *Promise‹IEnvironmentAuth›*

Defined in environments/environment.abstract.ts:150

Environment Authentication logic

**Parameters:**

Name | Type |
------ | ------ |
`redirectTo?` | undefined &#124; string |

**Returns:** *Promise‹IEnvironmentAuth›*

___

###  reloadConfig

▸ **reloadConfig**(): *Promise‹void›*

Defined in environments/environment.abstract.ts:208

Reloads config from disk

**Returns:** *Promise‹void›*

___

###  supports

▸ **supports**(`methodName`: PUBLIC_GRAPHQL_METHODS): *boolean*

Defined in environments/environment.abstract.ts:188

Checks if given GraphQL method is supported

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`methodName` | PUBLIC_GRAPHQL_METHODS |   |

**Returns:** *boolean*

___

###  updateConfig

▸ **updateConfig**(`key`: string, `value`: any): *Promise‹void›*

Defined in environments/environment.abstract.ts:220

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

Defined in environments/environment.abstract.ts:145

Verifies an API token

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`hostName` | string | host name of token request |
`clientId` | string | client ID of token request |
`token?` | undefined &#124; string | token to verify  |

**Returns:** *Promise‹void›*

___

###  verifyAuthToken

▸ **verifyAuthToken**(`token`: string): *Promise‹void›*

Defined in environments/environment.abstract.ts:176

Verifies an authentication token

**`throws`** AuthenticationError

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`token` | string | "" | token to verify |

**Returns:** *Promise‹void›*
