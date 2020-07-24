[@relate/common](../README.md) › [DbmssAbstract](dbmssabstract.md)

# Class: DbmssAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbmssAbstract**

## Index

### Constructors

* [constructor](dbmssabstract.md#constructor)

### Properties

* [dbmss](dbmssabstract.md#dbmss)

### Methods

* [addTags](dbmssabstract.md#abstract-addtags)
* [createAccessToken](dbmssabstract.md#abstract-createaccesstoken)
* [get](dbmssabstract.md#abstract-get)
* [getDbmsConfig](dbmssabstract.md#abstract-getdbmsconfig)
* [getJSONDriverInstance](dbmssabstract.md#getjsondriverinstance)
* [info](dbmssabstract.md#abstract-info)
* [install](dbmssabstract.md#abstract-install)
* [link](dbmssabstract.md#abstract-link)
* [list](dbmssabstract.md#abstract-list)
* [removeTags](dbmssabstract.md#abstract-removetags)
* [runQuery](dbmssabstract.md#runquery)
* [start](dbmssabstract.md#abstract-start)
* [stop](dbmssabstract.md#abstract-stop)
* [uninstall](dbmssabstract.md#abstract-uninstall)
* [updateConfig](dbmssabstract.md#abstract-updateconfig)
* [versions](dbmssabstract.md#abstract-versions)

## Constructors

###  constructor

\+ **new DbmssAbstract**(`environment`: Env): *[DbmssAbstract](dbmssabstract.md)*

*Defined in [dbmss/dbmss.abstract.ts:32](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L32)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | Env |

**Returns:** *[DbmssAbstract](dbmssabstract.md)*

## Properties

###  dbmss

• **dbmss**: *object*

*Defined in [dbmss/dbmss.abstract.ts:32](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L32)*

#### Type declaration:

* \[ **id**: *string*\]: IDbms

## Methods

### `Abstract` addTags

▸ **addTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:67](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L67)*

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`tags` | string[] |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` createAccessToken

▸ **createAccessToken**(`appName`: string, `dbmsId`: string, `authToken`: IAuthToken): *Promise‹string›*

*Defined in [dbmss/dbmss.abstract.ts:61](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L61)*

**Parameters:**

Name | Type |
------ | ------ |
`appName` | string |
`dbmsId` | string |
`authToken` | IAuthToken |

**Returns:** *Promise‹string›*

___

### `Abstract` get

▸ **get**(`nameOrId`: string): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:53](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L53)*

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` getDbmsConfig

▸ **getDbmsConfig**(`dbmsId`: string): *Promise‹PropertiesFile›*

*Defined in [dbmss/dbmss.abstract.ts:63](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L63)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |

**Returns:** *Promise‹PropertiesFile›*

___

###  getJSONDriverInstance

▸ **getJSONDriverInstance**(`dbmsId`: string, `authToken`: IAuthToken): *Promise‹Driver‹TapestryJSONResponse››*

*Defined in [dbmss/dbmss.abstract.ts:119](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L119)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`authToken` | IAuthToken |

**Returns:** *Promise‹Driver‹TapestryJSONResponse››*

___

### `Abstract` info

▸ **info**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹IDbmsInfo››*

*Defined in [dbmss/dbmss.abstract.ts:59](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L59)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |

**Returns:** *Promise‹List‹IDbmsInfo››*

___

### `Abstract` install

▸ **install**(`name`: string, `credentials`: string, `version`: string, `edition?`: NEO4J_EDITION, `noCaching?`: undefined | false | true, `limited?`: undefined | false | true): *Promise‹string›*

*Defined in [dbmss/dbmss.abstract.ts:38](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L38)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`credentials` | string |
`version` | string |
`edition?` | NEO4J_EDITION |
`noCaching?` | undefined &#124; false &#124; true |
`limited?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹string›*

___

### `Abstract` link

▸ **link**(`name`: string, `rootPath`: string): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:47](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L47)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`rootPath` | string |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbms››*

*Defined in [dbmss/dbmss.abstract.ts:51](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L51)*

**Parameters:**

Name | Type |
------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IDbms››*

___

### `Abstract` removeTags

▸ **removeTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:69](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L69)*

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`tags` | string[] |

**Returns:** *Promise‹IDbmsInfo›*

___

###  runQuery

▸ **runQuery**‹**Res**›(`driver`: Driver‹TapestryJSONResponse‹Res››, `query`: string, `params`: any, `retry`: number, `meta`: IQueryMeta): *Observable‹TapestryJSONResponse‹Res››*

*Defined in [dbmss/dbmss.abstract.ts:71](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L71)*

**Type parameters:**

▪ **Res**

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`driver` | Driver‹TapestryJSONResponse‹Res›› | - |
`query` | string | - |
`params` | any | {} |
`retry` | number | 0 |
`meta` | IQueryMeta | {} |

**Returns:** *Observable‹TapestryJSONResponse‹Res››*

___

### `Abstract` start

▸ **start**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

*Defined in [dbmss/dbmss.abstract.ts:55](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L55)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` stop

▸ **stop**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

*Defined in [dbmss/dbmss.abstract.ts:57](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L57)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsId`: string): *Promise‹void›*

*Defined in [dbmss/dbmss.abstract.ts:49](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |

**Returns:** *Promise‹void›*

___

### `Abstract` updateConfig

▸ **updateConfig**(`nameOrId`: string, `properties`: Map‹string, string›): *Promise‹boolean›*

*Defined in [dbmss/dbmss.abstract.ts:65](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L65)*

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`properties` | Map‹string, string› |

**Returns:** *Promise‹boolean›*

___

### `Abstract` versions

▸ **versions**(`limited?`: undefined | false | true, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsVersion››*

*Defined in [dbmss/dbmss.abstract.ts:36](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`limited?` | undefined &#124; false &#124; true |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IDbmsVersion››*
