[@relate/common](../README.md) › [DbmsPluginsAbstract](dbmspluginsabstract.md)

# Class: DbmsPluginsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **DbmsPluginsAbstract**

## Index

### Properties

* [sources](dbmspluginsabstract.md#sources)
* [versions](dbmspluginsabstract.md#versions)

### Methods

* [addSources](dbmspluginsabstract.md#abstract-addsources)
* [getSource](dbmspluginsabstract.md#abstract-getsource)
* [install](dbmspluginsabstract.md#abstract-install)
* [list](dbmspluginsabstract.md#abstract-list)
* [listSources](dbmspluginsabstract.md#abstract-listsources)
* [removeSources](dbmspluginsabstract.md#abstract-removesources)
* [uninstall](dbmspluginsabstract.md#abstract-uninstall)
* [upgrade](dbmspluginsabstract.md#abstract-upgrade)

## Properties

###  sources

• **sources**: *Record‹string, IDbmsPluginSource›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:8

___

###  versions

• **versions**: *Record‹string, IDbmsPluginVersion[]›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:10

## Methods

### `Abstract` addSources

▸ **addSources**(`urls`: string[]): *Promise‹List‹IDbmsPluginSource››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:33

Add one or more plugin sources

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`urls` | string[] | List of source URLs  |

**Returns:** *Promise‹List‹IDbmsPluginSource››*

___

### `Abstract` getSource

▸ **getSource**(`name`: string): *Promise‹IDbmsPluginSource›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:21

Get the source for a specific plugin

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *Promise‹IDbmsPluginSource›*

___

### `Abstract` install

▸ **install**(`dbmsNameOrId`: string, `pluginName`: string): *Promise‹IDbmsPluginVersion›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:56

Install a plugin in the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNameOrId` | string | - |
`pluginName` | string |   |

**Returns:** *Promise‹IDbmsPluginVersion›*

___

### `Abstract` list

▸ **list**(`dbmsNameOrId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsPluginVersion››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:46

List all plugins installed in the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNameOrId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsPluginVersion››*

___

### `Abstract` listSources

▸ **listSources**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsPluginSource››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:27

List all plugin sources

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsPluginSource››*

___

### `Abstract` removeSources

▸ **removeSources**(`urls`: string[]): *Promise‹List‹IDbmsPluginSource››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:39

Remove one or more plugin sources

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`urls` | string[] | List of source URLs  |

**Returns:** *Promise‹List‹IDbmsPluginSource››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsNameOrId`: string, `pluginName`: string): *Promise‹IDbmsPluginVersion›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:70

Uninstall a plugin from the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNameOrId` | string | - |
`pluginName` | string |   |

**Returns:** *Promise‹IDbmsPluginVersion›*

___

### `Abstract` upgrade

▸ **upgrade**(`dbmsNameOrId`: string, `pluginName`: string): *Promise‹IDbmsPluginVersion›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:63

Upgrade a plugin in the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNameOrId` | string | - |
`pluginName` | string |   |

**Returns:** *Promise‹IDbmsPluginVersion›*
