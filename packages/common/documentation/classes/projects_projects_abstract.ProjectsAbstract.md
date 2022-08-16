[@relate/common](../README.md) / [projects/projects.abstract](../modules/projects_projects_abstract.md) / ProjectsAbstract

# Class: ProjectsAbstract<Env\>

[projects/projects.abstract](../modules/projects_projects_abstract.md).ProjectsAbstract

## Type parameters

| Name | Type |
| :------ | :------ |
| `Env` | extends [`EnvironmentAbstract`](environments_environment_abstract.EnvironmentAbstract.md) |

## Table of contents

### Properties

- [manifest](projects_projects_abstract.ProjectsAbstract.md#manifest)

### Methods

- [addDbms](projects_projects_abstract.ProjectsAbstract.md#adddbms)
- [addFile](projects_projects_abstract.ProjectsAbstract.md#addfile)
- [create](projects_projects_abstract.ProjectsAbstract.md#create)
- [downloadSampleProject](projects_projects_abstract.ProjectsAbstract.md#downloadsampleproject)
- [get](projects_projects_abstract.ProjectsAbstract.md#get)
- [importSampleDbms](projects_projects_abstract.ProjectsAbstract.md#importsampledbms)
- [link](projects_projects_abstract.ProjectsAbstract.md#link)
- [list](projects_projects_abstract.ProjectsAbstract.md#list)
- [listDbmss](projects_projects_abstract.ProjectsAbstract.md#listdbmss)
- [listFiles](projects_projects_abstract.ProjectsAbstract.md#listfiles)
- [listSampleProjects](projects_projects_abstract.ProjectsAbstract.md#listsampleprojects)
- [prepareSampleProject](projects_projects_abstract.ProjectsAbstract.md#preparesampleproject)
- [removeDbms](projects_projects_abstract.ProjectsAbstract.md#removedbms)
- [removeFile](projects_projects_abstract.ProjectsAbstract.md#removefile)
- [unlink](projects_projects_abstract.ProjectsAbstract.md#unlink)
- [writeFile](projects_projects_abstract.ProjectsAbstract.md#writefile)

## Properties

### manifest

• `Readonly` `Abstract` **manifest**: [`ManifestAbstract`](manifest_manifest_abstract.ManifestAbstract.md)<`Env`, `IProject`, `ProjectManifestModel`\>

#### Defined in

[projects/projects.abstract.ts:25](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L25)

## Methods

### addDbms

▸ `Abstract` **addDbms**(`nameOrId`, `dbmsName`, `dbmsId`, `principal?`, `accessToken?`): `Promise`<`IProjectDbms`\>

Adds DBMS to given project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrId` | `string` | Project name or ID |
| `dbmsName` | `string` | Name to give DBMS in project |
| `dbmsId` | `string` |  |
| `principal?` | `string` | DBMS principal |
| `accessToken?` | `string` | DBMS access token |

#### Returns

`Promise`<`IProjectDbms`\>

#### Defined in

[projects/projects.abstract.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L114)

___

### addFile

▸ `Abstract` **addFile**(`nameOrId`, `source`, `destination?`, `overwrite?`): `Promise`<`IRelateFile`\>

Adds file (copy) to project

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `source` | `string` |
| `destination?` | `string` |
| `overwrite?` | `boolean` |

#### Returns

`Promise`<`IRelateFile`\>

#### Defined in

[projects/projects.abstract.ts:76](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L76)

___

### create

▸ `Abstract` **create**(`manifest`): `Promise`<`IProject`\>

Creates new project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `manifest` | `Omit`<`IProjectInput`, ``"id"``\> | Project data |

#### Returns

`Promise`<`IProject`\>

#### Defined in

[projects/projects.abstract.ts:36](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L36)

___

### downloadSampleProject

▸ `Abstract` **downloadSampleProject**(`url`, `name`, `destPath?`): `Promise`<{ `path`: `string` ; `temp`: `boolean`  }\>

Download sample project from github (https://github.com/neo4j-graph-examples)

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `name` | `string` |
| `destPath?` | `string` |

#### Returns

`Promise`<{ `path`: `string` ; `temp`: `boolean`  }\>

#### Defined in

[projects/projects.abstract.ts:137](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L137)

___

### get

▸ `Abstract` **get**(`nameOrId`): `Promise`<`IProject`\>

Gets a project by name

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |

#### Returns

`Promise`<`IProject`\>

#### Defined in

[projects/projects.abstract.ts:42](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L42)

___

### importSampleDbms

▸ `Abstract` **importSampleDbms**(`projectId`, `dbms`, `credentials`): `Promise`<{ `created`: `IDbmsInfo` ; `dump?`: `string` ; `script?`: `string`  }\>

Install sample DBMSs from file

#### Parameters

| Name | Type |
| :------ | :------ |
| `projectId` | `string` |
| `dbms` | `ISampleProjectDbms` |
| `credentials` | `string` |

#### Returns

`Promise`<{ `created`: `IDbmsInfo` ; `dump?`: `string` ; `script?`: `string`  }\>

#### Defined in

[projects/projects.abstract.ts:158](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L158)

___

### link

▸ `Abstract` **link**(`externalPath`, `name`): `Promise`<`IProject`\>

Links an existing project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `externalPath` | `string` | Path to project root |
| `name` | `string` |  |

#### Returns

`Promise`<`IProject`\>

#### Defined in

[projects/projects.abstract.ts:55](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L55)

___

### list

▸ `Abstract` **list**(`filters?`): `Promise`<`default`<`IProject`\>\>

List all available projects

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IProject`\>\>

#### Defined in

[projects/projects.abstract.ts:48](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L48)

___

### listDbmss

▸ `Abstract` **listDbmss**(`nameOrId`, `filters?`): `Promise`<`default`<`IProjectDbms`\>\>

Lists DBMSs for given project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrId` | `string` |  |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IProjectDbms`\>\>

#### Defined in

[projects/projects.abstract.ts:104](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L104)

___

### listFiles

▸ `Abstract` **listFiles**(`nameOrId`, `filters?`): `Promise`<`default`<`IRelateFile`\>\>

List files for given project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrId` | `string` |  |
| `filters?` | `default`<`IRelateFilter`\> \| `IRelateFilter`[] | Filters to apply |

#### Returns

`Promise`<`default`<`IRelateFile`\>\>

#### Defined in

[projects/projects.abstract.ts:68](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L68)

___

### listSampleProjects

▸ `Abstract` **listSampleProjects**(): `Promise`<`default`<`ISampleProjectRest`\>\>

Lists sample projects from github (https://github.com/neo4j-graph-examples)

#### Returns

`Promise`<`default`<`ISampleProjectRest`\>\>

#### Defined in

[projects/projects.abstract.ts:132](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L132)

___

### prepareSampleProject

▸ `Abstract` **prepareSampleProject**(`srcPath`, `args`): `Promise`<{ `install?`: `ISampleProjectInput` ; `project`: `IProjectInput`  }\>

Install sample project from file

#### Parameters

| Name | Type |
| :------ | :------ |
| `srcPath` | `string` |
| `args` | `Object` |
| `args.name?` | `string` |
| `args.projectId?` | `string` |
| `args.temp?` | `boolean` |

#### Returns

`Promise`<{ `install?`: `ISampleProjectInput` ; `project`: `IProjectInput`  }\>

#### Defined in

[projects/projects.abstract.ts:146](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L146)

___

### removeDbms

▸ `Abstract` **removeDbms**(`nameOrId`, `dbmsName`): `Promise`<`IProjectDbms`\>

removes DBMS from given project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrId` | `string` | Project name or ID |
| `dbmsName` | `string` |  |

#### Returns

`Promise`<`IProjectDbms`\>

#### Defined in

[projects/projects.abstract.ts:127](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L127)

___

### removeFile

▸ `Abstract` **removeFile**(`nameOrId`, `relativePath`): `Promise`<`IRelateFile`\>

Removes file from given project

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nameOrId` | `string` |  |
| `relativePath` | `string` | Path relative to project |

#### Returns

`Promise`<`IRelateFile`\>

#### Defined in

[projects/projects.abstract.ts:97](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L97)

___

### unlink

▸ `Abstract` **unlink**(`nameOrId`): `Promise`<`IProject`\>

Unlinks a linked project

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |

#### Returns

`Promise`<`IProject`\>

#### Defined in

[projects/projects.abstract.ts:61](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L61)

___

### writeFile

▸ `Abstract` **writeFile**(`nameOrId`, `destination`, `data`, `writeFlag?`): `Promise`<`IRelateFile`\>

Adds file (write) to project

#### Parameters

| Name | Type |
| :------ | :------ |
| `nameOrId` | `string` |
| `destination` | `string` |
| `data` | `string` \| `Buffer` |
| `writeFlag?` | `WriteFileFlag` |

#### Returns

`Promise`<`IRelateFile`\>

#### Defined in

[projects/projects.abstract.ts:85](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L85)
