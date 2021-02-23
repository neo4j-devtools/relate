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

▸ **addSources**(`sources`: List‹IDbmsPluginSource› | IDbmsPluginSource[]): *Promise‹List‹IDbmsPluginSource››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:33

Add one or more plugin sources

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`sources` | List‹IDbmsPluginSource› &#124; IDbmsPluginSource[] | List of sources  |

**Returns:** *Promise‹List‹IDbmsPluginSource››*

___

### `Abstract` getSource

▸ **getSource**(`name`: string): *Promise‹IDbmsPluginSource›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:21

Get the source for a plugin

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *Promise‹IDbmsPluginSource›*

___

### `Abstract` install

▸ **install**(`dbmsNamesOrIds`: string[] | List‹string›, `pluginName`: string): *Promise‹List‹IDbmsPluginInstalled››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:56

Install a plugin in the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNamesOrIds` | string[] &#124; List‹string› | - |
`pluginName` | string |   |

**Returns:** *Promise‹List‹IDbmsPluginInstalled››*

___

### `Abstract` list

▸ **list**(`dbmsNameOrId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IDbmsPluginInstalled››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:46

List all plugins installed in the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNameOrId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IDbmsPluginInstalled››*

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

▸ **removeSources**(`names`: string[]): *Promise‹List‹IDbmsPluginSource››*

Defined in dbms-plugins/dbms-plugins.abstract.ts:39

Remove one or more plugin sources

**Parameters:**

Name | Type |
------ | ------ |
`names` | string[] |

**Returns:** *Promise‹List‹IDbmsPluginSource››*

___

### `Abstract` uninstall

▸ **uninstall**(`dbmsNamesOrIds`: string[] | List‹string›, `pluginName`: string): *Promise‹void›*

Defined in dbms-plugins/dbms-plugins.abstract.ts:63

Uninstall a plugin from the specified DBMS

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`dbmsNamesOrIds` | string[] &#124; List‹string› | - |
`pluginName` | string |   |

**Returns:** *Promise‹void›*
