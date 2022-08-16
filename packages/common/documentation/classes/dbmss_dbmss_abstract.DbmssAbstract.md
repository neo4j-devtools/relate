[@relate/common](../README.md) / [dbmss/dbmss.abstract](../modules/dbmss_dbmss_abstract.md) / DbmssAbstract

# Class: DbmssAbstract<Env\>

[dbmss/dbmss.abstract](../modules/dbmss_dbmss_abstract.md).DbmssAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Properties

- [manifest](dbmss_dbmss_abstract.DbmssAbstract.md#manifest)

### Methods

- [clone](dbmss_dbmss_abstract.DbmssAbstract.md#clone)
- [createAccessToken](dbmss_dbmss_abstract.DbmssAbstract.md#createaccesstoken)
- [get](dbmss_dbmss_abstract.DbmssAbstract.md#get)
- [getDbmsConfig](dbmss_dbmss_abstract.DbmssAbstract.md#getdbmsconfig)
- [info](dbmss_dbmss_abstract.DbmssAbstract.md#info)
- [install](dbmss_dbmss_abstract.DbmssAbstract.md#install)
- [link](dbmss_dbmss_abstract.DbmssAbstract.md#link)
- [list](dbmss_dbmss_abstract.DbmssAbstract.md#list)
- [start](dbmss_dbmss_abstract.DbmssAbstract.md#start)
- [stop](dbmss_dbmss_abstract.DbmssAbstract.md#stop)
- [uninstall](dbmss_dbmss_abstract.DbmssAbstract.md#uninstall)
- [updateConfig](dbmss_dbmss_abstract.DbmssAbstract.md#updateconfig)
- [upgrade](dbmss_dbmss_abstract.DbmssAbstract.md#upgrade)
- [versions](dbmss_dbmss_abstract.DbmssAbstract.md#versions)

## Properties

### manifest

• `Readonly` `Abstract` **manifest**: [`ManifestAbstract`](manifest_manifest_abstract.ManifestAbstract.md)<`Env`, `IDbmsInfo`, `DbmsManifestModel`\>

#### Defined in

[dbmss/dbmss.abstract.ts:28](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L28)

## Methods

### clone

▸ `Abstract` **clone**(`id`, `name`): `Promise`<`IDbmsInfo`\>

Clone a DBMS

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |
| `name` | `string` |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:76](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L76)

___

### createAccessToken

▸ `Abstract` **createAccessToken**(`appName`, `dbmsId`, `authToken`): `Promise`<`string`\>

Creates an access token for a given app, DBMS, and DBMS credentials

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `dbmsId` | `string` |
| `authToken` | `IAuthToken` |

#### Returns

`Promise`<`string`\>

#### Defined in

[dbmss/dbmss.abstract.ts:120](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L120)

___

### get

▸ `Abstract` **get**(`nameOrId`): `Promise`<`IDbmsInfo`\>

Get a DBMS by name or id

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:94](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L94)

___

### getDbmsConfig

▸ `Abstract` **getDbmsConfig**(`dbmsId`): `Promise`<`PropertiesFile`\>

Get dbms configuration (neo4j.conf)

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsId` | `string` |

#### Returns

`Promise`<`PropertiesFile`\>

#### Defined in

[dbmss/dbmss.abstract.ts:126](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L126)

___

### info

▸ `Abstract` **info**(`dbmsIds`, `onlineCheck?`): `Promise`<`default`<`IDbmsInfo`\>\>

Get info for one or more DBMSs

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsIds` | `string`[] \| `default`<`string`\> |
| `onlineCheck?` | `boolean` |

#### Returns

`Promise`<`default`<`IDbmsInfo`\>\>

#### Defined in

[dbmss/dbmss.abstract.ts:112](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L112)

___

### install

▸ `Abstract` **install**(`name`, `version`, `edition?`, `credentials?`, `overrideCache?`, `limited?`, `installPath?`): `Promise`<`IDbmsInfo`\>

Installs new DBMS

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | DBMS name |
| `version` | `string` | neo4j version |
| `edition?` | `NEO4J_EDITION` | neo4j edition |
| `credentials?` | `string` | Initial password to set |
| `overrideCache?` | `boolean` | Download distribution even if it's present in cache |
| `limited?` | `boolean` | Is limited version |
| `installPath?` | `string` | A user selected path to install to, if not provided the default location will be used. |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:52](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L52)

___

### link

▸ `Abstract` **link**(`externalPath`, `name`): `Promise`<`IDbmsInfo`\>

Links an existing DBMS to relate

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalPath` | `string` | Path to DBMS root |
| `name` | `string` | Name of DBMS |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:69](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L69)

___

### list

▸ `Abstract` **list**(`filters?`): `Promise`<`default`<`IDbms`\>\>

List all DBMS

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IDbms`\>\>

#### Defined in

[dbmss/dbmss.abstract.ts:88](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L88)

___

### start

▸ `Abstract` **start**(`dbmsIds`): `Promise`<`default`<`string`\>\>

Start one or more DBMSs

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsIds` | `string`[] \| `default`<`string`\> |

#### Returns

`Promise`<`default`<`string`\>\>

#### Defined in

[dbmss/dbmss.abstract.ts:100](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L100)

___

### stop

▸ `Abstract` **stop**(`dbmsIds`): `Promise`<`default`<`string`\>\>

Stop one or more DBMSs

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsIds` | (`string` \| `IQueryTarget`)[] \| `default`<`string` \| `IQueryTarget`\> |

#### Returns

`Promise`<`default`<`string`\>\>

#### Defined in

[dbmss/dbmss.abstract.ts:106](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L106)

___

### uninstall

▸ `Abstract` **uninstall**(`dbmsId`): `Promise`<`IDbmsInfo`\>

Uninstall a DBMS

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsId` | `string` |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:82](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L82)

___

### updateConfig

▸ `Abstract` **updateConfig**(`nameOrId`, `properties`): `Promise`<`boolean`\>

Set dbms configuration properties (neo4j.conf)

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `properties` | `Map`<`string`, `string`\> |

#### Returns

`Promise`<`boolean`\>

#### Defined in

[dbmss/dbmss.abstract.ts:132](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L132)

___

### upgrade

▸ `Abstract` **upgrade**(`dbmsId`, `version`, `options?`): `Promise`<`IDbmsInfo`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsId` | `string` |
| `version` | `string` |
| `options?` | `IDbmsUpgradeOptions` |

#### Returns

`Promise`<`IDbmsInfo`\>

#### Defined in

[dbmss/dbmss.abstract.ts:62](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L62)

___

### versions

▸ `Abstract` **versions**(`limited?`, `filters?`): `Promise`<`default`<`IDbmsVersion`\>\>

List all available DBMS versions to install

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `limited?` | `boolean` | Include limited versions |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IDbmsVersion`\>\>

#### Defined in

[dbmss/dbmss.abstract.ts:40](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbmss/dbmss.abstract.ts#L40)
