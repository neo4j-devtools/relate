[@relate/common](../README.md) / [extensions/extensions.abstract](../modules/extensions_extensions_abstract.md) / ExtensionsAbstract

# Class: ExtensionsAbstract<Env\>

[extensions/extensions.abstract](../modules/extensions_extensions_abstract.md).ExtensionsAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Methods

- [createAppLaunchToken](extensions_extensions_abstract.ExtensionsAbstract.md#createapplaunchtoken)
- [getAppPath](extensions_extensions_abstract.ExtensionsAbstract.md#getapppath)
- [install](extensions_extensions_abstract.ExtensionsAbstract.md#install)
- [link](extensions_extensions_abstract.ExtensionsAbstract.md#link)
- [list](extensions_extensions_abstract.ExtensionsAbstract.md#list)
- [listApps](extensions_extensions_abstract.ExtensionsAbstract.md#listapps)
- [parseAppLaunchToken](extensions_extensions_abstract.ExtensionsAbstract.md#parseapplaunchtoken)
- [uninstall](extensions_extensions_abstract.ExtensionsAbstract.md#uninstall)
- [versions](extensions_extensions_abstract.ExtensionsAbstract.md#versions)

## Methods

### createAppLaunchToken

▸ `Abstract` **createAppLaunchToken**(`appName`, `dbmsId`, `principal?`, `accessToken?`, `projectId?`): `Promise`<`string`\>

Creates an app launch token, for passing DBMS info and credentials to app

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `appName` | `string` | Installed app to create token for |
| `dbmsId` | `string` |  |
| `principal?` | `string` | DBMS principal |
| `accessToken?` | `string` | DBMS access token |
| `projectId?` | `string` |  |

#### Returns

`Promise`<`string`\>

#### Defined in

extensions/extensions.abstract.ts:66

___

### getAppPath

▸ `Abstract` **getAppPath**(`appName`, `appRoot?`): `Promise`<`string`\>

Gets path to app entry point

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `appRoot?` | `string` |

#### Returns

`Promise`<`string`\>

#### Defined in

extensions/extensions.abstract.ts:19

___

### install

▸ `Abstract` **install**(`name`, `version`): `Promise`<`IExtensionInfo`\>

Install given extension

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `version` | `string` |

#### Returns

`Promise`<`IExtensionInfo`\>

#### Defined in

extensions/extensions.abstract.ts:50

___

### link

▸ `Abstract` **link**(`filePath`): `Promise`<`IExtensionInfo`\>

Link local extension (useful for development)

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |

#### Returns

`Promise`<`IExtensionInfo`\>

#### Defined in

extensions/extensions.abstract.ts:37

___

### list

▸ `Abstract` **list**(`filters?`): `Promise`<`default`<`IExtensionInfo`\>\>

List all installed extensions

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IExtensionInfo`\>\>

#### Defined in

extensions/extensions.abstract.ts:25

___

### listApps

▸ `Abstract` **listApps**(`filters?`): `Promise`<`default`<`IExtensionInfo`\>\>

List all installed apps

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IExtensionInfo`\>\>

#### Defined in

extensions/extensions.abstract.ts:31

___

### parseAppLaunchToken

▸ `Abstract` **parseAppLaunchToken**(`appName`, `launchToken`): `Promise`<`IAppLaunchToken`\>

Decodes app launch token

#### Parameters

| Name | Type |
| :------ | :------ |
| `appName` | `string` |
| `launchToken` | `string` |

#### Returns

`Promise`<`IAppLaunchToken`\>

#### Defined in

extensions/extensions.abstract.ts:79

___

### uninstall

▸ `Abstract` **uninstall**(`name`): `Promise`<`default`<`IExtensionInfo`\>\>

Uninstall given extension

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |

#### Returns

`Promise`<`default`<`IExtensionInfo`\>\>

#### Defined in

extensions/extensions.abstract.ts:56

___

### versions

▸ `Abstract` **versions**(`filters?`): `Promise`<`default`<`IExtensionVersion`\>\>

List all available extensions to install

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IExtensionVersion`\>\>

#### Defined in

extensions/extensions.abstract.ts:43
