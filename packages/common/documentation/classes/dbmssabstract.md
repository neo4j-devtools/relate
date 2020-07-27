[@relate/common](../README.md) › [DbmssAbstract](dbmssabstract.md)

# Class: DbmssAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbmssAbstract**

## Index

### Methods

* [addTags](dbmssabstract.md#abstract-addtags)
* [createAccessToken](dbmssabstract.md#abstract-createaccesstoken)
* [get](dbmssabstract.md#abstract-get)
* [getDbmsConfig](dbmssabstract.md#abstract-getdbmsconfig)
* [info](dbmssabstract.md#abstract-info)
* [install](dbmssabstract.md#abstract-install)
* [link](dbmssabstract.md#abstract-link)
* [list](dbmssabstract.md#abstract-list)
* [removeTags](dbmssabstract.md#abstract-removetags)
* [start](dbmssabstract.md#abstract-start)
* [stop](dbmssabstract.md#abstract-stop)
* [uninstall](dbmssabstract.md#abstract-uninstall)
* [updateConfig](dbmssabstract.md#abstract-updateconfig)
* [versions](dbmssabstract.md#abstract-versions)

## Methods

### `Abstract` addTags

▸ **addTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:135](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L135)*

Add tags to a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`tags` | string[] |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` createAccessToken

▸ **createAccessToken**(`appName`: string, `dbmsId`: string, `authToken`: IAuthToken): *Promise‹string›*

*Defined in [dbmss/dbmss.abstract.ts:116](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L116)*

Creates an access token for a given app, DBMS, and DBMS credentials

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`appName` | string | - |
`dbmsId` | string | - |
`authToken` | IAuthToken |   |

**Returns:** *Promise‹string›*

___

### `Abstract` get

▸ **get**(`nameOrId`: string): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:90](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L90)*

Get a DBMS by name or id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` getDbmsConfig

▸ **getDbmsConfig**(`dbmsId`: string): *Promise‹PropertiesFile›*

*Defined in [dbmss/dbmss.abstract.ts:122](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L122)*

Get dbms configuration (neo4j.conf)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹PropertiesFile›*

___

### `Abstract` info

▸ **info**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹IDbmsInfo››*

*Defined in [dbmss/dbmss.abstract.ts:108](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L108)*

Get info for one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹IDbmsInfo››*

___

### `Abstract` install

▸ **install**(`name`: string, `credentials`: string, `version`: string, `edition?`: NEO4J_EDITION, `noCaching?`: undefined | false | true, `limited?`: undefined | false | true): *Promise‹string›*

*Defined in [dbmss/dbmss.abstract.ts:58](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L58)*

Installs new DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | DBMS name |
`credentials` | string | Initial password to set |
`version` | string | neo4j version |
`edition?` | NEO4J_EDITION | neo4j edition |
`noCaching?` | undefined &#124; false &#124; true | Do not use distribution cache |
`limited?` | undefined &#124; false &#124; true | Is limited version  |

**Returns:** *Promise‹string›*

___

### `Abstract` link

▸ **link**(`name`: string, `rootPath`: string): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:72](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L72)*

Links an existing DBMS to relate

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | Name of DBMS |
`rootPath` | string | Path to DBMS root  |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbms››*

*Defined in [dbmss/dbmss.abstract.ts:84](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L84)*

List all DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbms››*

___

### `Abstract` removeTags

▸ **removeTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

*Defined in [dbmss/dbmss.abstract.ts:142](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L142)*

Remove tags from a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`tags` | string[] |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` start

▸ **start**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

*Defined in [dbmss/dbmss.abstract.ts:96](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L96)*

Start one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` stop

▸ **stop**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

*Defined in [dbmss/dbmss.abstract.ts:102](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L102)*

Stop one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsId`: string): *Promise‹void›*

*Defined in [dbmss/dbmss.abstract.ts:78](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L78)*

Uninstall a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹void›*

___

### `Abstract` updateConfig

▸ **updateConfig**(`nameOrId`: string, `properties`: Map‹string, string›): *Promise‹boolean›*

*Defined in [dbmss/dbmss.abstract.ts:128](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L128)*

Set dbms configuration properties (neo4j.conf)

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`properties` | Map‹string, string› |

**Returns:** *Promise‹boolean›*

___

### `Abstract` versions

▸ **versions**(`limited?`: undefined | false | true, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsVersion››*

*Defined in [dbmss/dbmss.abstract.ts:47](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L47)*

List all available DBMS versions to install

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`limited?` | undefined &#124; false &#124; true | Include limited versions |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsVersion››*
