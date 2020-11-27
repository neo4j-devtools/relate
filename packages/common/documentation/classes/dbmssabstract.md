[@relate/common](../README.md) › [DbmssAbstract](dbmssabstract.md)

# Class: DbmssAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbmssAbstract**

## Index

### Properties

* [manifest](dbmssabstract.md#readonly-abstract-manifest)

### Methods

* [clone](dbmssabstract.md#abstract-clone)
* [createAccessToken](dbmssabstract.md#abstract-createaccesstoken)
* [get](dbmssabstract.md#abstract-get)
* [getDbmsConfig](dbmssabstract.md#abstract-getdbmsconfig)
* [info](dbmssabstract.md#abstract-info)
* [install](dbmssabstract.md#abstract-install)
* [link](dbmssabstract.md#abstract-link)
* [list](dbmssabstract.md#abstract-list)
* [start](dbmssabstract.md#abstract-start)
* [stop](dbmssabstract.md#abstract-stop)
* [uninstall](dbmssabstract.md#abstract-uninstall)
* [updateConfig](dbmssabstract.md#abstract-updateconfig)
* [upgrade](dbmssabstract.md#abstract-upgrade)
* [versions](dbmssabstract.md#abstract-versions)

## Properties

### `Readonly` `Abstract` manifest

• **manifest**: *[ManifestAbstract](manifestabstract.md)‹Env, IDbmsInfo, DbmsManifestModel›*

Defined in dbmss/dbmss.abstract.ts:38

## Methods

### `Abstract` clone

▸ **clone**(`id`: string, `name`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:90

Clone a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | - |
`name` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` createAccessToken

▸ **createAccessToken**(`appName`: string, `dbmsId`: string, `authToken`: IAuthToken): *Promise‹string›*

Defined in dbmss/dbmss.abstract.ts:134

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

Defined in dbmss/dbmss.abstract.ts:108

Get a DBMS by name or id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` getDbmsConfig

▸ **getDbmsConfig**(`dbmsId`: string): *Promise‹PropertiesFile›*

Defined in dbmss/dbmss.abstract.ts:140

Get dbms configuration (neo4j.conf)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹PropertiesFile›*

___

### `Abstract` info

▸ **info**(`dbmsIds`: string[] | List‹string›, `onlineCheck?`: undefined | false | true): *Promise‹List‹IDbmsInfo››*

Defined in dbmss/dbmss.abstract.ts:126

Get info for one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |
`onlineCheck?` | undefined &#124; false &#124; true | - |

**Returns:** *Promise‹List‹IDbmsInfo››*

___

### `Abstract` install

▸ **install**(`name`: string, `version`: string, `edition?`: NEO4J_EDITION, `credentials?`: undefined | string, `overrideCache?`: undefined | false | true, `limited?`: undefined | false | true): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:61

Installs new DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | DBMS name |
`version` | string | neo4j version |
`edition?` | NEO4J_EDITION | neo4j edition |
`credentials?` | undefined &#124; string | Initial password to set |
`overrideCache?` | undefined &#124; false &#124; true | Download distribution even if it's present in cache |
`limited?` | undefined &#124; false &#124; true | Is limited version  |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` link

▸ **link**(`externalPath`: string, `name`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:83

Links an existing DBMS to relate

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalPath` | string | Path to DBMS root |
`name` | string | Name of DBMS  |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbms››*

Defined in dbmss/dbmss.abstract.ts:102

List all DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbms››*

___

### `Abstract` start

▸ **start**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

Defined in dbmss/dbmss.abstract.ts:114

Start one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` stop

▸ **stop**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

Defined in dbmss/dbmss.abstract.ts:120

Stop one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsId`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:96

Uninstall a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` updateConfig

▸ **updateConfig**(`nameOrId`: string, `properties`: Map‹string, string›): *Promise‹boolean›*

Defined in dbmss/dbmss.abstract.ts:146

Set dbms configuration properties (neo4j.conf)

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`properties` | Map‹string, string› |

**Returns:** *Promise‹boolean›*

___

### `Abstract` upgrade

▸ **upgrade**(`dbmsId`: string, `version`: string, `migrate?`: undefined | false | true, `backup?`: undefined | false | true, `noCache?`: undefined | false | true): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:70

**Parameters:**

Name | Type |
------ | ------ |
`dbmsId` | string |
`version` | string |
`migrate?` | undefined &#124; false &#124; true |
`backup?` | undefined &#124; false &#124; true |
`noCache?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` versions

▸ **versions**(`limited?`: undefined | false | true, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsVersion››*

Defined in dbmss/dbmss.abstract.ts:50

List all available DBMS versions to install

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`limited?` | undefined &#124; false &#124; true | Include limited versions |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsVersion››*
