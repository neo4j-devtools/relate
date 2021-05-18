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
* [installSampleProject](projectsabstract.md#abstract-installsampleproject)
* [link](projectsabstract.md#abstract-link)
* [list](projectsabstract.md#abstract-list)
* [listDbmss](projectsabstract.md#abstract-listdbmss)
* [listFiles](projectsabstract.md#abstract-listfiles)
* [listSampleProjects](projectsabstract.md#abstract-listsampleprojects)
* [removeDbms](projectsabstract.md#abstract-removedbms)
* [removeFile](projectsabstract.md#abstract-removefile)
* [unlink](projectsabstract.md#abstract-unlink)
* [writeFile](projectsabstract.md#abstract-writefile)

## Properties

### `Readonly` `Abstract` manifest

• **manifest**: *[ManifestAbstract](manifestabstract.md)‹Env, IProject, ProjectManifestModel›*

*Defined in [projects/projects.abstract.ts:26](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L26)*

## Methods

### `Abstract` addDbms

▸ **addDbms**(`nameOrId`: string, `dbmsName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:115](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L115)*

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

*Defined in [projects/projects.abstract.ts:77](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L77)*

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

*Defined in [projects/projects.abstract.ts:37](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L37)*

Creates new project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`manifest` | Omit‹IProjectInput, "id"› | Project data  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` downloadSampleProject

▸ **downloadSampleProject**(`url`: string, `name`: string, `destPath?`: undefined | string): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:138](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L138)*

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

*Defined in [projects/projects.abstract.ts:43](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L43)*

Gets a project by name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` importSampleDbms

▸ **importSampleDbms**(`projectId`: string, `dbms`: ISampleProjectDbms, `credentials`: string): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:159](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L159)*

Install sample DBMSs from file

**Parameters:**

Name | Type |
------ | ------ |
`projectId` | string |
`dbms` | ISampleProjectDbms |
`credentials` | string |

**Returns:** *Promise‹object›*

___

### `Abstract` installSampleProject

▸ **installSampleProject**(`srcPath`: string, `args`: object): *Promise‹object›*

*Defined in [projects/projects.abstract.ts:147](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L147)*

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

### `Abstract` link

▸ **link**(`externalPath`: string, `name`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:56](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L56)*

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

*Defined in [projects/projects.abstract.ts:49](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L49)*

List all available projects

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProject››*

___

### `Abstract` listDbmss

▸ **listDbmss**(`nameOrId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProjectDbms››*

*Defined in [projects/projects.abstract.ts:105](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L105)*

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

*Defined in [projects/projects.abstract.ts:69](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L69)*

List files for given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IRelateFile››*

___

### `Abstract` listSampleProjects

▸ **listSampleProjects**(`fetch?`: undefined | function): *Promise‹List‹ISampleProjectRest››*

*Defined in [projects/projects.abstract.ts:133](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L133)*

Lists sample projects from github (https://github.com/neo4j-graph-examples)

**Parameters:**

Name | Type |
------ | ------ |
`fetch?` | undefined &#124; function |

**Returns:** *Promise‹List‹ISampleProjectRest››*

___

### `Abstract` removeDbms

▸ **removeDbms**(`nameOrId`: string, `dbmsName`: string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:128](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L128)*

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

*Defined in [projects/projects.abstract.ts:98](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L98)*

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

*Defined in [projects/projects.abstract.ts:62](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L62)*

Unlinks a linked project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` writeFile

▸ **writeFile**(`nameOrId`: string, `destination`: string, `data`: string | Buffer, `writeFlag?`: WriteFileFlag): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:86](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L86)*

Adds file (write) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrId` | string | - |
`destination` | string | - |
`data` | string &#124; Buffer | - |
`writeFlag?` | WriteFileFlag |   |

**Returns:** *Promise‹IRelateFile›*
