[@relate/common](../README.md) / [dbms-plugins/dbms-plugins.abstract](../modules/dbms_plugins_dbms_plugins_abstract.md) / DbmsPluginsAbstract

# Class: DbmsPluginsAbstract<Env\>

[dbms-plugins/dbms-plugins.abstract](../modules/dbms_plugins_dbms_plugins_abstract.md).DbmsPluginsAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Properties

- [sources](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#sources)
- [versions](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#versions)

### Methods

- [addSources](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#addsources)
- [getSource](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#getsource)
- [install](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#install)
- [list](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#list)
- [listSources](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#listsources)
- [previewUpgrade](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#previewupgrade)
- [removeSources](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#removesources)
- [uninstall](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md#uninstall)

## Properties

### sources

• **sources**: `Record`<`string`, `IDbmsPluginSource`\> = `{}`

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:8](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L8)

___

### versions

• **versions**: `Record`<`string`, `IDbmsPluginVersion`[]\> = `{}`

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:10](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L10)

## Methods

### addSources

▸ `Abstract` **addSources**(`sources`): `Promise`<`default`<`IDbmsPluginSource`\>\>

Add one or more plugin sources

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `sources` | `default`<`IDbmsPluginSource`\> \| `IDbmsPluginSource`[] | List of sources |

#### Returns

`Promise`<`default`<`IDbmsPluginSource`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:33](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L33)

___

### getSource

▸ `Abstract` **getSource**(`name`): `Promise`<`IDbmsPluginSource`\>

Get the source for a plugin

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`IDbmsPluginSource`\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:21](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L21)

___

### install

▸ `Abstract` **install**(`dbmsNamesOrIds`, `pluginName`): `Promise`<`default`<`IDbmsPluginInstalled`\>\>

Install a plugin in the specified DBMS

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsNamesOrIds` | `string`[] \| `default`<`string`\> |
| `pluginName` | `string` |

#### Returns

`Promise`<`default`<`IDbmsPluginInstalled`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:64](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L64)

___

### list

▸ `Abstract` **list**(`dbmsNameOrId`, `filters?`): `Promise`<`default`<`IDbmsPluginInstalled`\>\>

List all plugins installed in the specified DBMS

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsNameOrId` | `string` |  |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IDbmsPluginInstalled`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:46](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L46)

___

### listSources

▸ `Abstract` **listSources**(`filters?`): `Promise`<`default`<`IDbmsPluginSource`\>\>

List all plugin sources

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IDbmsPluginSource`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:27](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L27)

___

### previewUpgrade

▸ `Abstract` **previewUpgrade**(`dbmsNameOrId`, `dbmsTargetVersion`): `Promise`<`default`<`IDbmsPluginUpgradable`\>\>

Preview plugin versions that would be installed if the DBMS
containing them would be upgraded.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `dbmsNameOrId` | `string` |  |
| `dbmsTargetVersion` | `string` | Version the DBMS would be upgraded to |

#### Returns

`Promise`<`default`<`IDbmsPluginUpgradable`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:57](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L57)

___

### removeSources

▸ `Abstract` **removeSources**(`names`): `Promise`<`default`<`IDbmsPluginSource`\>\>

Remove one or more plugin sources

#### Parameters

| Name | Type |
| :------ | :------ |
| `names` | `string`[] |

#### Returns

`Promise`<`default`<`IDbmsPluginSource`\>\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:39](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L39)

___

### uninstall

▸ `Abstract` **uninstall**(`dbmsNamesOrIds`, `pluginName`): `Promise`<`void`\>

Uninstall a plugin from the specified DBMS

#### Parameters

| Name | Type |
| :------ | :------ |
| `dbmsNamesOrIds` | `string`[] \| `default`<`string`\> |
| `pluginName` | `string` |

#### Returns

`Promise`<`void`\>

#### Defined in

[dbms-plugins/dbms-plugins.abstract.ts:71](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/dbms-plugins/dbms-plugins.abstract.ts#L71)
