[@relate/common](../README.md) › [ExtensionsAbstract](extensionsabstract.md)

# Class: ExtensionsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **ExtensionsAbstract**

## Index

### Methods

* [createAppLaunchToken](extensionsabstract.md#abstract-createapplaunchtoken)
* [getAppPath](extensionsabstract.md#abstract-getapppath)
* [install](extensionsabstract.md#abstract-install)
* [link](extensionsabstract.md#abstract-link)
* [list](extensionsabstract.md#abstract-list)
* [listApps](extensionsabstract.md#abstract-listapps)
* [parseAppLaunchToken](extensionsabstract.md#abstract-parseapplaunchtoken)
* [uninstall](extensionsabstract.md#abstract-uninstall)
* [versions](extensionsabstract.md#abstract-versions)

## Methods

### `Abstract` createAppLaunchToken

▸ **createAppLaunchToken**(`appName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string, `projectId?`: undefined | string): *Promise‹string›*

*Defined in [extensions/extensions.abstract.ts:66](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L66)*

Creates an app launch token, for passing DBMS info and credentials to app

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`appName` | string | Installed app to create token for |
`dbmsId` | string | - |
`principal?` | undefined &#124; string | DBMS principal |
`accessToken?` | undefined &#124; string | DBMS access token |
`projectId?` | undefined &#124; string |   |

**Returns:** *Promise‹string›*

___

### `Abstract` getAppPath

▸ **getAppPath**(`appName`: string, `appRoot?`: undefined | string): *Promise‹string›*

*Defined in [extensions/extensions.abstract.ts:19](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L19)*

Gets path to app entry point

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`appName` | string | - |
`appRoot?` | undefined &#124; string |   |

**Returns:** *Promise‹string›*

___

### `Abstract` install

▸ **install**(`name`: string, `version`: string): *Promise‹IExtensionMeta›*

*Defined in [extensions/extensions.abstract.ts:50](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L50)*

Install given extension

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string | - |
`version` | string |   |

**Returns:** *Promise‹IExtensionMeta›*

___

### `Abstract` link

▸ **link**(`filePath`: string): *Promise‹IExtensionMeta›*

*Defined in [extensions/extensions.abstract.ts:37](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L37)*

Link local extension (useful for development)

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filePath` | string |   |

**Returns:** *Promise‹IExtensionMeta›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:25](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L25)*

List all installed extensions

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` listApps

▸ **listApps**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:31](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L31)*

List all installed apps

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` parseAppLaunchToken

▸ **parseAppLaunchToken**(`appName`: string, `launchToken`: string): *Promise‹IAppLaunchToken›*

*Defined in [extensions/extensions.abstract.ts:79](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L79)*

Decodes app launch token

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`appName` | string | - |
`launchToken` | string |   |

**Returns:** *Promise‹IAppLaunchToken›*

___

### `Abstract` uninstall

▸ **uninstall**(`name`: string): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:56](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L56)*

Uninstall given extension

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`name` | string |   |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` versions

▸ **versions**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionVersion››*

*Defined in [extensions/extensions.abstract.ts:43](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L43)*

List all available extensions to install

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IExtensionVersion››*
