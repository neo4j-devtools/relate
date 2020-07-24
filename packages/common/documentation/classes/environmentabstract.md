[@relate/common](../README.md) › [EnvironmentAbstract](environmentabstract.md)

# Class: EnvironmentAbstract

## Hierarchy

* **EnvironmentAbstract**

## Index

### Constructors

* [constructor](environmentabstract.md#constructor)

### Properties

* [dbmss](environmentabstract.md#readonly-dbmss)
* [dbs](environmentabstract.md#readonly-dbs)
* [dirPaths](environmentabstract.md#readonly-dirpaths)
* [extensions](environmentabstract.md#readonly-extensions)
* [projects](environmentabstract.md#readonly-projects)

### Accessors

* [active](environmentabstract.md#active)
* [configPath](environmentabstract.md#configpath)
* [httpOrigin](environmentabstract.md#httporigin)
* [id](environmentabstract.md#id)
* [name](environmentabstract.md#name)
* [neo4jDataPath](environmentabstract.md#neo4jdatapath)
* [remoteEnvironmentId](environmentabstract.md#remoteenvironmentid)
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

## Constructors

###  constructor

\+ **new EnvironmentAbstract**(`config`: EnvironmentConfigModel): *[EnvironmentAbstract](environmentabstract.md)*

*Defined in [environments/environment.abstract.ts:64](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L64)*

**Parameters:**

Name | Type |
------ | ------ |
`config` | EnvironmentConfigModel |

**Returns:** *[EnvironmentAbstract](environmentabstract.md)*

## Properties

### `Readonly` dbmss

• **dbmss**: *[DbmssAbstract](dbmssabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:22](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L22)*

___

### `Readonly` dbs

• **dbs**: *[DbsAbstract](dbsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:24](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L24)*

___

### `Readonly` dirPaths

• **dirPaths**: *object*

*Defined in [environments/environment.abstract.ts:30](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L30)*

#### Type declaration:

* \[ **key**: *string*\]: string

___

### `Readonly` extensions

• **extensions**: *[ExtensionsAbstract](extensionsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:26](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L26)*

___

### `Readonly` projects

• **projects**: *[ProjectsAbstract](projectsabstract.md)‹[EnvironmentAbstract](environmentabstract.md)›*

*Defined in [environments/environment.abstract.ts:28](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L28)*

## Accessors

###  active

• **get active**(): *boolean*

*Defined in [environments/environment.abstract.ts:42](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L42)*

**Returns:** *boolean*

___

###  configPath

• **get configPath**(): *string*

*Defined in [environments/environment.abstract.ts:54](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L54)*

**Returns:** *string*

___

###  httpOrigin

• **get httpOrigin**(): *string*

*Defined in [environments/environment.abstract.ts:50](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L50)*

**Returns:** *string*

___

###  id

• **get id**(): *string*

*Defined in [environments/environment.abstract.ts:34](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L34)*

**Returns:** *string*

___

###  name

• **get name**(): *string*

*Defined in [environments/environment.abstract.ts:38](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L38)*

**Returns:** *string*

___

###  neo4jDataPath

• **get neo4jDataPath**(): *string*

*Defined in [environments/environment.abstract.ts:62](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L62)*

**Returns:** *string*

___

###  remoteEnvironmentId

• **get remoteEnvironmentId**(): *string | undefined*

*Defined in [environments/environment.abstract.ts:58](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L58)*

**Returns:** *string | undefined*

___

###  type

• **get type**(): *ENVIRONMENT_TYPES*

*Defined in [environments/environment.abstract.ts:46](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L46)*

**Returns:** *ENVIRONMENT_TYPES*

## Methods

###  generateAuthToken

▸ **generateAuthToken**(`code`: string): *Promise‹string›*

*Defined in [environments/environment.abstract.ts:102](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L102)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`code` | string | "" |

**Returns:** *Promise‹string›*

___

###  getConfigValue

▸ **getConfigValue**‹**K**›(`key`: K): *Promise‹EnvironmentConfigModel[K]›*

*Defined in [environments/environment.abstract.ts:128](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L128)*

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

*Defined in [environments/environment.abstract.ts:92](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L92)*

**Returns:** *Promise‹void›*

___

###  login

▸ **login**(`redirectTo?`: undefined | string): *Promise‹IEnvironmentAuth›*

*Defined in [environments/environment.abstract.ts:94](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L94)*

**Parameters:**

Name | Type |
------ | ------ |
`redirectTo?` | undefined &#124; string |

**Returns:** *Promise‹IEnvironmentAuth›*

___

###  reloadConfig

▸ **reloadConfig**(): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:132](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L132)*

**Returns:** *Promise‹void›*

___

###  supports

▸ **supports**(`methodName`: string): *boolean*

*Defined in [environments/environment.abstract.ts:118](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L118)*

**Parameters:**

Name | Type |
------ | ------ |
`methodName` | string |

**Returns:** *boolean*

___

###  updateConfig

▸ **updateConfig**(`key`: string, `value`: any): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:141](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L141)*

**Parameters:**

Name | Type |
------ | ------ |
`key` | string |
`value` | any |

**Returns:** *Promise‹void›*

___

###  verifyAuthToken

▸ **verifyAuthToken**(`token`: string): *Promise‹void›*

*Defined in [environments/environment.abstract.ts:110](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/environments/environment.abstract.ts#L110)*

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`token` | string | "" |

**Returns:** *Promise‹void›*
