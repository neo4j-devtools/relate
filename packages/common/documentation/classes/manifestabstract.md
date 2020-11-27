[@relate/common](../README.md) › [ManifestAbstract](manifestabstract.md)

# Class: ManifestAbstract ‹**Environment, Entity, Manifest**›

## Type parameters

▪ **Environment**: *[EnvironmentAbstract](environmentabstract.md)*

▪ **Entity**: *IManifest*

▪ **Manifest**: *ManifestModel‹Entity›*

## Hierarchy

* **ManifestAbstract**

## Index

### Methods

* [addTags](manifestabstract.md#abstract-addtags)
* [get](manifestabstract.md#abstract-get)
* [removeMetadata](manifestabstract.md#abstract-removemetadata)
* [removeTags](manifestabstract.md#abstract-removetags)
* [setMetadata](manifestabstract.md#abstract-setmetadata)
* [update](manifestabstract.md#abstract-update)

## Methods

### `Abstract` addTags

▸ **addTags**(`nameOrId`: string, `tags`: string[]): *Promise‹Entity›*

Defined in manifest/manifest.abstract.ts:39

Add tags to an entity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`tags` | string[] |   |

**Returns:** *Promise‹Entity›*

___

### `Abstract` get

▸ **get**(`id`: string): *Promise‹Manifest›*

Defined in manifest/manifest.abstract.ts:52

Get an entity's manifest

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string |   |

**Returns:** *Promise‹Manifest›*

___

### `Abstract` removeMetadata

▸ **removeMetadata**(`nameOrId`: string, ...`keys`: string[]): *Promise‹Entity›*

Defined in manifest/manifest.abstract.ts:32

Remove metadata from an entity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`...keys` | string[] |   |

**Returns:** *Promise‹Entity›*

___

### `Abstract` removeTags

▸ **removeTags**(`nameOrId`: string, `tags`: string[]): *Promise‹Entity›*

Defined in manifest/manifest.abstract.ts:46

Remove tags from an entity

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`tags` | string[] |   |

**Returns:** *Promise‹Entity›*

___

### `Abstract` setMetadata

▸ **setMetadata**(`nameOrId`: string, `key`: string, `value`: any): *Promise‹Entity›*

Defined in manifest/manifest.abstract.ts:25

Add metadata to an entity

**Parameters:**

Name | Type |
------ | ------ |
`nameOrId` | string |
`key` | string |
`value` | any |

**Returns:** *Promise‹Entity›*

___

### `Abstract` update

▸ **update**(`id`: string, `update`: Partial‹Omit‹Entity, "id"››): *Promise‹void›*

Defined in manifest/manifest.abstract.ts:59

Update an entity's manifest

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`id` | string | - |
`update` | Partial‹Omit‹Entity, "id"›› | Portion of the manifest to update  |

**Returns:** *Promise‹void›*
