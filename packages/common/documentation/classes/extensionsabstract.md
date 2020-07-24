[@relate/common](../README.md) › [ExtensionsAbstract](extensionsabstract.md)

# Class: ExtensionsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **ExtensionsAbstract**

## Index

### Constructors

* [constructor](extensionsabstract.md#constructor)

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

## Constructors

###  constructor

\+ **new ExtensionsAbstract**(`environment`: Env): *[ExtensionsAbstract](extensionsabstract.md)*

*Defined in [extensions/extensions.abstract.ts:8](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | Env |

**Returns:** *[ExtensionsAbstract](extensionsabstract.md)*

## Methods

### `Abstract` createAppLaunchToken

▸ **createAppLaunchToken**(`appName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string, `projectId?`: undefined | string): *Promise‹string›*

*Defined in [extensions/extensions.abstract.ts:25](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`appName` | string |
`dbmsId` | string |
`principal?` | undefined &#124; string |
`accessToken?` | undefined &#124; string |
`projectId?` | undefined &#124; string |

**Returns:** *Promise‹string›*

___

### `Abstract` getAppPath

▸ **getAppPath**(`appName`: string, `appRoot?`: undefined | string): *Promise‹string›*

*Defined in [extensions/extensions.abstract.ts:11](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L11)*

**Parameters:**

Name | Type |
------ | ------ |
`appName` | string |
`appRoot?` | undefined &#124; string |

**Returns:** *Promise‹string›*

___

### `Abstract` install

▸ **install**(`name`: string, `version`: string): *Promise‹IExtensionMeta›*

*Defined in [extensions/extensions.abstract.ts:21](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L21)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |
`version` | string |

**Returns:** *Promise‹IExtensionMeta›*

___

### `Abstract` link

▸ **link**(`filePath`: string): *Promise‹IExtensionMeta›*

*Defined in [extensions/extensions.abstract.ts:17](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L17)*

**Parameters:**

Name | Type |
------ | ------ |
`filePath` | string |

**Returns:** *Promise‹IExtensionMeta›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:13](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L13)*

**Parameters:**

Name | Type |
------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` listApps

▸ **listApps**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:15](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L15)*

**Parameters:**

Name | Type |
------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` parseAppLaunchToken

▸ **parseAppLaunchToken**(`appName`: string, `launchToken`: string): *Promise‹IAppLaunchToken›*

*Defined in [extensions/extensions.abstract.ts:33](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L33)*

**Parameters:**

Name | Type |
------ | ------ |
`appName` | string |
`launchToken` | string |

**Returns:** *Promise‹IAppLaunchToken›*

___

### `Abstract` uninstall

▸ **uninstall**(`name`: string): *Promise‹List‹IExtensionMeta››*

*Defined in [extensions/extensions.abstract.ts:23](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L23)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *Promise‹List‹IExtensionMeta››*

___

### `Abstract` versions

▸ **versions**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IExtensionVersion››*

*Defined in [extensions/extensions.abstract.ts:19](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/extensions/extensions.abstract.ts#L19)*

**Parameters:**

Name | Type |
------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IExtensionVersion››*
