[@relate/common](../README.md) › [ProjectsAbstract](projectsabstract.md)

# Class: ProjectsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **ProjectsAbstract**

## Index

### Properties

* [manifest](projectsabstract.md#readonly-abstract-manifest)

### Methods

* [addDbms](projectsabstract.md#abstract-adddbms)
* [addFile](projectsabstract.md#abstract-addfile)
* [create](projectsabstract.md#abstract-create)
* [downloadSampleProject](projectsabstract.md#abstract-downloadsampleproject)
* [get](projectsabstract.md#abstract-get)
* [importSampleDbms](projectsabstract.md#abstract-importsampledbms)
* [link](projectsabstract.md#abstract-link)
* [list](projectsabstract.md#abstract-list)
* [listDbmss](projectsabstract.md#abstract-listdbmss)
* [listFiles](projectsabstract.md#abstract-listfiles)
* [listSampleProjects](projectsabstract.md#abstract-listsampleprojects)
* [prepareSampleProject](projectsabstract.md#abstract-preparesampleproject)
* [removeDbms](projectsabstract.md#abstract-removedbms)
* [removeFile](projectsabstract.md#abstract-removefile)
* [unlink](projectsabstract.md#abstract-unlink)
* [writeFile](projectsabstract.md#abstract-writefile)

## Properties

### `Readonly` `Abstract` manifest

• **manifest**: *[ManifestAbstract](manifestabstract.md)‹Env, IProject, ProjectManifestModel›*

*Defined in [projects/projects.abstract.ts:25](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L25)*

## Methods

### `Abstract` addDbms

▸ **addDbms**(`nameOrId`: string, `dbmsName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:114](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L114)*

Adds DBMS to given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | Project name or ID |
`dbmsName` | string | Name to give DBMS in project |
`dbmsId` | string | - |
`principal?` | undefined &#124; string | DBMS principal |
`accessToken?` | undefined &#124; string | DBMS access token  |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` addFile

▸ **addFile**(`nameOrId`: string, `source`: string, `destination?`: undefined | string, `overwrite?`: undefined | false | true): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:76](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L76)*

Adds file (copy) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`source` | string | - |
`destination?` | undefined &#124; string |   |
`overwrite?` | undefined &#124; false &#124; true | - |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` create

▸ **create**(`manifest`: Omit‹IProjectInput, "id"›): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:36](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L36)*

Creates new project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`manifest` | Omit‹IProjectInput, "id"› | Project data  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` downloadSampleProject

▸ **downloadSampleProject**(`url`: string, `name`: string, `destPath?`: undefined | string): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:137](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L137)*

Download sample project from github (https://github.com/neo4j-graph-examples)

**Parameters:**

Name | Type |
------ | ------ |
`url` | string |
`name` | string |
`destPath?` | undefined &#124; string |

**Returns:** *Promise‹object›*

___

### `Abstract` get

▸ **get**(`nameOrId`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:42](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L42)*

Gets a project by name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` importSampleDbms

▸ **importSampleDbms**(`projectId`: string, `dbms`: ISampleProjectDbms, `credentials`: string): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:158](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L158)*

Install sample DBMSs from file

**Parameters:**

Name | Type |
------ | ------ |
`projectId` | string |
`dbms` | ISampleProjectDbms |
`credentials` | string |

**Returns:** *Promise‹object›*

___

### `Abstract` link

▸ **link**(`externalPath`: string, `name`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:55](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L55)*

Links an existing project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`externalPath` | string | Path to project root |
`name` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProject››*

*Defined in [projects/projects.abstract.ts:48](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L48)*

List all available projects

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProject››*

___

### `Abstract` listDbmss

▸ **listDbmss**(`nameOrId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProjectDbms››*

*Defined in [projects/projects.abstract.ts:104](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L104)*

Lists DBMSs for given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProjectDbms››*

___

### `Abstract` listFiles

▸ **listFiles**(`nameOrId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IRelateFile››*

*Defined in [projects/projects.abstract.ts:68](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L68)*

List files for given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IRelateFile››*

___

### `Abstract` listSampleProjects

▸ **listSampleProjects**(): *Promise‹List‹ISampleProjectRest››*

*Defined in [projects/projects.abstract.ts:132](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L132)*

Lists sample projects from github (https://github.com/neo4j-graph-examples)

**Returns:** *Promise‹List‹ISampleProjectRest››*

___

### `Abstract` prepareSampleProject

▸ **prepareSampleProject**(`srcPath`: string, `args`: object): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:146](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L146)*

Install sample project from file

**Parameters:**

▪ **srcPath**: *string*

▪ **args**: *object*

Name | Type |
------ | ------ |
`name?` | undefined &#124; string |
`projectId?` | undefined &#124; string |
`temp?` | undefined &#124; false &#124; true |

**Returns:** *Promise‹object›*

___

### `Abstract` removeDbms

▸ **removeDbms**(`nameOrId`: string, `dbmsName`: string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:127](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L127)*

removes DBMS from given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | Project name or ID |
`dbmsName` | string |   |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` removeFile

▸ **removeFile**(`nameOrId`: string, `relativePath`: string): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:97](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L97)*

Removes file from given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`relativePath` | string | Path relative to project  |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` unlink

▸ **unlink**(`nameOrId`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:61](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L61)*

Unlinks a linked project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` writeFile

▸ **writeFile**(`nameOrId`: string, `destination`: string, `data`: string | Buffer, `writeFlag?`: WriteFileFlag): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:85](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L85)*

Adds file (write) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`destination` | string | - |
`data` | string &#124; Buffer | - |
`writeFlag?` | WriteFileFlag |   |

**Returns:** *Promise‹IRelateFile›*
