[@relate/common](../README.md) › [DbmssAbstract](dbmssabstract.md)

# Class: DbmssAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbmssAbstract**

## Index

### Methods

* [addTags](dbmssabstract.md#abstract-addtags)
* [clone](dbmssabstract.md#abstract-clone)
* [createAccessToken](dbmssabstract.md#abstract-createaccesstoken)
* [get](dbmssabstract.md#abstract-get)
* [getDbmsConfig](dbmssabstract.md#abstract-getdbmsconfig)
* [getDbmsManifest](dbmssabstract.md#abstract-getdbmsmanifest)
* [info](dbmssabstract.md#abstract-info)
* [install](dbmssabstract.md#abstract-install)
* [link](dbmssabstract.md#abstract-link)
* [list](dbmssabstract.md#abstract-list)
* [removeTags](dbmssabstract.md#abstract-removetags)
* [start](dbmssabstract.md#abstract-start)
* [stop](dbmssabstract.md#abstract-stop)
* [uninstall](dbmssabstract.md#abstract-uninstall)
* [updateConfig](dbmssabstract.md#abstract-updateconfig)
* [updateDbmsManifest](dbmssabstract.md#abstract-updatedbmsmanifest)
* [upgrade](dbmssabstract.md#abstract-upgrade)
* [versions](dbmssabstract.md#abstract-versions)

## Methods

### `Abstract` addTags

▸ **addTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:150

Add tags to a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`tags` | string[] |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` clone

▸ **clone**(`id`: string, `name`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:87

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

Defined in dbmss/dbmss.abstract.ts:131

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

Defined in dbmss/dbmss.abstract.ts:105

Get a DBMS by name or id

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` getDbmsConfig

▸ **getDbmsConfig**(`dbmsId`: string): *Promise‹PropertiesFile›*

Defined in dbmss/dbmss.abstract.ts:137

Get dbms configuration (neo4j.conf)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹PropertiesFile›*

___

### `Abstract` getDbmsManifest

▸ **getDbmsManifest**(`dbmsId`: string): *Promise‹DbmsManifestModel›*

Defined in dbmss/dbmss.abstract.ts:170

Gets a DBMS manifest

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹DbmsManifestModel›*

___

### `Abstract` info

▸ **info**(`dbmsIds`: string[] | List‹string›, `onlineCheck?`: undefined | false | true): *Promise‹List‹IDbmsInfo››*

Defined in dbmss/dbmss.abstract.ts:123

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

Defined in dbmss/dbmss.abstract.ts:58

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

▸ **link**(`name`: string, `rootPath`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:80

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

Defined in dbmss/dbmss.abstract.ts:99

List all DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbms››*

___

### `Abstract` removeTags

▸ **removeTags**(`nameOrId`: string, `tags`: string[]): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:157

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

Defined in dbmss/dbmss.abstract.ts:111

Start one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` stop

▸ **stop**(`dbmsIds`: string[] | List‹string›): *Promise‹List‹string››*

Defined in dbmss/dbmss.abstract.ts:117

Stop one or more DBMSs

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsIds` | string[] &#124; List‹string› |   |

**Returns:** *Promise‹List‹string››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsId`: string): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:93

Uninstall a DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string |   |

**Returns:** *Promise‹IDbmsInfo›*

___

### `Abstract` updateConfig

▸ **updateConfig**(`nameOrId`: string, `properties`: Map‹string, string›): *Promise‹boolean›*

Defined in dbmss/dbmss.abstract.ts:143

Set dbms configuration properties (neo4j.conf)

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`properties` | Map‹string, string› |

**Returns:** *Promise‹boolean›*

___

### `Abstract` updateDbmsManifest

▸ **updateDbmsManifest**(`dbmsId`: string, `update`: Partial‹Omit‹IDbmsManifest, "id"››): *Promise‹void›*

Defined in dbmss/dbmss.abstract.ts:164

Updates a DBMS manifest

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsId` | string | - |
`update` | Partial‹Omit‹IDbmsManifest, "id"›› |   |

**Returns:** *Promise‹void›*

___

### `Abstract` upgrade

▸ **upgrade**(`dbmsId`: string, `version`: string, `migrate?`: undefined | false | true, `backup?`: undefined | false | true, `noCache?`: undefined | false | true): *Promise‹IDbmsInfo›*

Defined in dbmss/dbmss.abstract.ts:67

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

Defined in dbmss/dbmss.abstract.ts:47

List all available DBMS versions to install

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`limited?` | undefined &#124; false &#124; true | Include limited versions |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsVersion››*
