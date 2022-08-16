[@relate/common](../README.md) / [backups/backup.abstract](../modules/backups_backup_abstract.md) / BackupAbstract

# Class: BackupAbstract<Env\>

[backups/backup.abstract](../modules/backups_backup_abstract.md).BackupAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Methods

- [create](backups_backup_abstract.BackupAbstract.md#create)
- [get](backups_backup_abstract.BackupAbstract.md#get)
- [list](backups_backup_abstract.BackupAbstract.md#list)
- [remove](backups_backup_abstract.BackupAbstract.md#remove)
- [restore](backups_backup_abstract.BackupAbstract.md#restore)

## Methods

### create

▸ `Abstract` **create**(`entityType`, `entityNameOrId`, `entityMeta?`): `Promise`<`IRelateBackup`\>

Creates a backup of a relate entity

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entityType` | `ENTITY_TYPES` |  |
| `entityNameOrId` | `string` |  |
| `entityMeta?` | `any` | Any additional meta to save in the backup manifest |

#### Returns

`Promise`<`IRelateBackup`\>

#### Defined in

[backups/backup.abstract.ts:20](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L20)

___

### get

▸ `Abstract` **get**(`backupNameOrId`): `Promise`<`IRelateBackup`\>

Gets a backup

#### Parameters

| Name | Type |
| :------ | :------ |
| `backupNameOrId` | `string` |

#### Returns

`Promise`<`IRelateBackup`\>

#### Defined in

[backups/backup.abstract.ts:33](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L33)

___

### list

▸ `Abstract` **list**(`filters?`): `Promise`<`default`<`IRelateBackup`\>\>

List all backups

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IRelateBackup`\>\>

#### Defined in

[backups/backup.abstract.ts:45](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L45)

___

### remove

▸ `Abstract` **remove**(`backupNameOrId`): `Promise`<`IRelateBackup`\>

Removes a backup

#### Parameters

| Name | Type |
| :------ | :------ |
| `backupNameOrId` | `string` |

#### Returns

`Promise`<`IRelateBackup`\>

#### Defined in

[backups/backup.abstract.ts:39](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L39)

___

### restore

▸ `Abstract` **restore**(`filePath`, `outputPath?`): `Promise`<{ `entityId`: `string` ; `entityType`: `ENTITY_TYPES`  }\>

Restores a backup from path

#### Parameters

| Name | Type |
| :------ | :------ |
| `filePath` | `string` |
| `outputPath?` | `string` |

#### Returns

`Promise`<{ `entityId`: `string` ; `entityType`: `ENTITY_TYPES`  }\>

#### Defined in

[backups/backup.abstract.ts:27](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L27)
