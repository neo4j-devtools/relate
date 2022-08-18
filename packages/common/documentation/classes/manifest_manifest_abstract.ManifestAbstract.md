[@relate/common](../README.md) / [manifest/manifest.abstract](../modules/manifest_manifest_abstract.md) / ManifestAbstract

# Class: ManifestAbstract<Environment, Entity, Manifest\>

[manifest/manifest.abstract](../modules/manifest_manifest_abstract.md).ManifestAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Environment` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |
| `Entity` | extends `IManifest` |
| `Manifest` | extends `ManifestModel`<`Entity`\> |

## Table of contents

### Methods

- [addTags](manifest_manifest_abstract.ManifestAbstract.md#addtags)
- [get](manifest_manifest_abstract.ManifestAbstract.md#get)
- [removeMetadata](manifest_manifest_abstract.ManifestAbstract.md#removemetadata)
- [removeTags](manifest_manifest_abstract.ManifestAbstract.md#removetags)
- [setMetadata](manifest_manifest_abstract.ManifestAbstract.md#setmetadata)
- [update](manifest_manifest_abstract.ManifestAbstract.md#update)

## Methods

### addTags

▸ `Abstract` **addTags**(`nameOrId`, `tags`): `Promise`<`Entity`\>

Add tags to an entity

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `tags` | `string`[] |

#### Returns

`Promise`<`Entity`\>

#### Defined in

manifest/manifest.abstract.ts:39

___

### get

▸ `Abstract` **get**(`id`): `Promise`<`Manifest`\>

Get an entity's manifest

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

`Promise`<`Manifest`\>

#### Defined in

manifest/manifest.abstract.ts:52

___

### removeMetadata

▸ `Abstract` **removeMetadata**(`nameOrId`, ...`keys`): `Promise`<`Entity`\>

Remove metadata from an entity

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `...keys` | `string`[] |

#### Returns

`Promise`<`Entity`\>

#### Defined in

manifest/manifest.abstract.ts:32

___

### removeTags

▸ `Abstract` **removeTags**(`nameOrId`, `tags`): `Promise`<`Entity`\>

Remove tags from an entity

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `tags` | `string`[] |

#### Returns

`Promise`<`Entity`\>

#### Defined in

manifest/manifest.abstract.ts:46

___

### setMetadata

▸ `Abstract` **setMetadata**(`nameOrId`, `key`, `value`): `Promise`<`Entity`\>

Add metadata to an entity

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `key` | `string` |
| `value` | `any` |

#### Returns

`Promise`<`Entity`\>

#### Defined in

manifest/manifest.abstract.ts:25

___

### update

▸ `Abstract` **update**(`id`, `update`): `Promise`<`void`\>

Update an entity's manifest

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` |  |
| `update` | `Partial`<`Omit`<`Entity`, ``"id"``\>\> | Portion of the manifest to update |

#### Returns

`Promise`<`void`\>

#### Defined in

manifest/manifest.abstract.ts:59
