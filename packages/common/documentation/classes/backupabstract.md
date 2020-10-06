[@relate/common](../README.md) › [BackupAbstract](backupabstract.md)

# Class: BackupAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **BackupAbstract**

## Index

### Methods

* [create](backupabstract.md#abstract-create)
* [get](backupabstract.md#abstract-get)
* [list](backupabstract.md#abstract-list)
* [remove](backupabstract.md#abstract-remove)
* [restore](backupabstract.md#abstract-restore)

## Methods

### `Abstract` create

▸ **create**(`entityType`: ENTITY_TYPES, `entityNameOrId`: string, `entityMeta?`: any): *Promise‹IRelateBackup›*

*Defined in [backups/backup.abstract.ts:20](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L20)*

Creates a backup of a relate entity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`entityType` | ENTITY_TYPES | - |
`entityNameOrId` | string | - |
`entityMeta?` | any | Any additional meta to save in the backup manifest  |

**Returns:** *Promise‹IRelateBackup›*

___

### `Abstract` get

▸ **get**(`backupNameOrId`: string): *Promise‹IRelateBackup›*

*Defined in [backups/backup.abstract.ts:33](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L33)*

Gets a backup

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`backupNameOrId` | string |   |

**Returns:** *Promise‹IRelateBackup›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IRelateBackup››*

*Defined in [backups/backup.abstract.ts:45](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L45)*

List all backups

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IRelateBackup››*

___

### `Abstract` remove

▸ **remove**(`backupNameOrId`: string): *Promise‹IRelateBackup›*

*Defined in [backups/backup.abstract.ts:39](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L39)*

Removes a backup

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`backupNameOrId` | string |   |

**Returns:** *Promise‹IRelateBackup›*

___

### `Abstract` restore

▸ **restore**(`filePath`: string, `outputPath?`: undefined | string): *Promise‹object›*

*Defined in [backups/backup.abstract.ts:27](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/backups/backup.abstract.ts#L27)*

Restores a backup from path

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filePath` | string | - |
`outputPath?` | undefined &#124; string |   |

**Returns:** *Promise‹object›*
