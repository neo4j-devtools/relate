[@relate/common](../README.md) / [environments/environment.abstract](../modules/environments_environment_abstract.md) / EnvironmentAbstract

# Class: EnvironmentAbstract

[environments/environment.abstract](../modules/environments_environment_abstract.md).EnvironmentAbstract

## Table of contents

### Properties

- [backups](environments_environment_abstract.EnvironmentAbstract.md#backups)
- [dbmsPlugins](environments_environment_abstract.EnvironmentAbstract.md#dbmsplugins)
- [dbmss](environments_environment_abstract.EnvironmentAbstract.md#dbmss)
- [dbs](environments_environment_abstract.EnvironmentAbstract.md#dbs)
- [projects](environments_environment_abstract.EnvironmentAbstract.md#projects)

### Accessors

- [httpOrigin](environments_environment_abstract.EnvironmentAbstract.md#httporigin)
- [id](environments_environment_abstract.EnvironmentAbstract.md#id)
- [isActive](environments_environment_abstract.EnvironmentAbstract.md#isactive)
- [name](environments_environment_abstract.EnvironmentAbstract.md#name)
- [requiresAPIToken](environments_environment_abstract.EnvironmentAbstract.md#requiresapitoken)
- [type](environments_environment_abstract.EnvironmentAbstract.md#type)

### Methods

- [generateAPIToken](environments_environment_abstract.EnvironmentAbstract.md#generateapitoken)
- [getConfigValue](environments_environment_abstract.EnvironmentAbstract.md#getconfigvalue)
- [init](environments_environment_abstract.EnvironmentAbstract.md#init)
- [reloadConfig](environments_environment_abstract.EnvironmentAbstract.md#reloadconfig)
- [supports](environments_environment_abstract.EnvironmentAbstract.md#supports)
- [updateConfig](environments_environment_abstract.EnvironmentAbstract.md#updateconfig)
- [verifyAPIToken](environments_environment_abstract.EnvironmentAbstract.md#verifyapitoken)

## Properties

### backups

• `Readonly` **backups**: [`BackupAbstract`](backups_backup_abstract.BackupAbstract.md)<[`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md)\>

#### Defined in

environments/environment.abstract.ts:26

___

### dbmsPlugins

• `Readonly` **dbmsPlugins**: [`DbmsPluginsAbstract`](dbms_plugins_dbms_plugins_abstract.DbmsPluginsAbstract.md)<[`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md)\>

#### Defined in

environments/environment.abstract.ts:20

___

### dbmss

• `Readonly` **dbmss**: [`DbmssAbstract`](dbmss_dbmss_abstract.DbmssAbstract.md)<[`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md)\>

#### Defined in

environments/environment.abstract.ts:18

___

### dbs

• `Readonly` **dbs**: [`DbsAbstract`](dbs_dbs_abstract.DbsAbstract.md)<[`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md)\>

#### Defined in

environments/environment.abstract.ts:22

___

### projects

• `Readonly` **projects**: [`ProjectsAbstract`](projects_projects_abstract.ProjectsAbstract.md)<[`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md)\>

#### Defined in

environments/environment.abstract.ts:24

## Accessors

### httpOrigin

• `get` **httpOrigin**(): `string`

#### Returns

`string`

#### Defined in

environments/environment.abstract.ts:52

___

### id

• `get` **id**(): `string`

#### Returns

`string`

#### Defined in

environments/environment.abstract.ts:33

___

### isActive

• `get` **isActive**(): `boolean`

Indicates if environment is current active

#### Returns

`boolean`

#### Defined in

environments/environment.abstract.ts:44

___

### name

• `get` **name**(): `string`

#### Returns

`string`

#### Defined in

environments/environment.abstract.ts:37

___

### requiresAPIToken

• `get` **requiresAPIToken**(): `boolean`

#### Returns

`boolean`

#### Defined in

environments/environment.abstract.ts:56

___

### type

• `get` **type**(): `LOCAL`

#### Returns

`LOCAL`

#### Defined in

environments/environment.abstract.ts:48

## Methods

### generateAPIToken

▸ `Abstract` **generateAPIToken**(`hostName`, `clientId`, `data`): `Promise`<`string`\>

Generates an API token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hostName` | `string` | host name of token request |
| `clientId` | `string` | client ID of token request |
| `data` | `any` | API token data |

#### Returns

`Promise`<`string`\>

token

#### Defined in

environments/environment.abstract.ts:98

___

### getConfigValue

▸ **getConfigValue**<`K`\>(`key`): `Promise`<`EnvironmentConfigModel`[`K`]\>

Gets config value for given key

#### Type parameters

| Name | Type |
| :------ | :------ |
| `K` | extends keyof `EnvironmentConfigModel` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `K` |

#### Returns

`Promise`<`EnvironmentConfigModel`[`K`]\>

#### Defined in

environments/environment.abstract.ts:125

___

### init

▸ `Abstract` **init**(): `Promise`<`void`\>

Environment initialisation logic

#### Returns

`Promise`<`void`\>

#### Defined in

environments/environment.abstract.ts:89

___

### reloadConfig

▸ **reloadConfig**(): `Promise`<`void`\>

Reloads config from disk

#### Returns

`Promise`<`void`\>

#### Defined in

environments/environment.abstract.ts:132

___

### supports

▸ **supports**(`methodName`): `boolean`

Checks if given GraphQL method is supported

#### Parameters

| Name | Type |
| :------ | :------ |
| `methodName` | `PUBLIC_GRAPHQL_METHODS` |

#### Returns

`boolean`

#### Defined in

environments/environment.abstract.ts:112

___

### updateConfig

▸ **updateConfig**(`key`, `value`): `Promise`<`void`\>

Updates config on disk

#### Parameters

| Name | Type |
| :------ | :------ |
| `key` | `string` |
| `value` | `any` |

#### Returns

`Promise`<`void`\>

#### Defined in

environments/environment.abstract.ts:144

___

### verifyAPIToken

▸ `Abstract` **verifyAPIToken**(`hostName`, `clientId`, `token?`): `Promise`<`void`\>

Verifies an API token

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hostName` | `string` | host name of token request |
| `clientId` | `string` | client ID of token request |
| `token?` | `string` | token to verify |

#### Returns

`Promise`<`void`\>

#### Defined in

environments/environment.abstract.ts:106
