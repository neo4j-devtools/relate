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
* [get](projectsabstract.md#abstract-get)
* [link](projectsabstract.md#abstract-link)
* [list](projectsabstract.md#abstract-list)
* [listDbmss](projectsabstract.md#abstract-listdbmss)
* [listFiles](projectsabstract.md#abstract-listfiles)
* [removeDbms](projectsabstract.md#abstract-removedbms)
* [removeFile](projectsabstract.md#abstract-removefile)
* [writeFile](projectsabstract.md#abstract-writefile)

## Properties

### `Readonly` `Abstract` manifest

• **manifest**: *[ManifestAbstract](manifestabstract.md)‹Env, IProject, ProjectManifestModel›*

*Defined in [projects/projects.abstract.ts:14](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L14)*

## Methods

### `Abstract` addDbms

▸ **addDbms**(`projectId`: string, `dbmsName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:102](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L102)*

Adds DBMS to given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`dbmsName` | string | Name to give DBMS in project |
`dbmsId` | string | - |
`principal?` | undefined &#124; string | DBMS principal |
`accessToken?` | undefined &#124; string | DBMS access token  |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` addFile

▸ **addFile**(`projectId`: string, `source`: string, `destination?`: undefined | string, `overwrite?`: undefined | false | true): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:59](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L59)*

Adds file (copy) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`source` | string | - |
`destination?` | undefined &#124; string |   |
`overwrite?` | undefined &#124; false &#124; true | - |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` create

▸ **create**(`manifest`: Omit‹IProjectInput, "id"›, `path?`: undefined | string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:26](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L26)*

Creates new project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`manifest` | Omit‹IProjectInput, "id"› | Project data |
`path?` | undefined &#124; string | Path to project root  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` get

▸ **get**(`nameOrID`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:32](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L32)*

Gets a project by name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrID` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` link

▸ **link**(`filePath`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:44](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L44)*

Links an existing project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filePath` | string | Path to project root  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProject››*

*Defined in [projects/projects.abstract.ts:38](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L38)*

List all available projects

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProject››*

___

### `Abstract` listDbmss

▸ **listDbmss**(`projectId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProjectDbms››*

*Defined in [projects/projects.abstract.ts:92](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L92)*

Lists DBMSs for given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProjectDbms››*

___

### `Abstract` listFiles

▸ **listFiles**(`projectId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IRelateFile››*

*Defined in [projects/projects.abstract.ts:51](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L51)*

List files for given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IRelateFile››*

___

### `Abstract` removeDbms

▸ **removeDbms**(`projectId`: string, `dbmsName`: string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:115](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L115)*

removes DBMS from given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`dbmsName` | string |   |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` removeFile

▸ **removeFile**(`projectId`: string, `relativePath`: string): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:85](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L85)*

Removes file from given project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`relativePath` | string | Path relative to project  |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` writeFile

▸ **writeFile**(`projectId`: string, `destination`: string, `data`: string | Buffer, `writeFlag?`: WriteFileFlag): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:73](https://github.com/neo4j-devtools/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L73)*

Adds file (write) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`destination` | string | - |
`data` | string &#124; Buffer | - |
`writeFlag?` | WriteFileFlag |   |

**Returns:** *Promise‹IRelateFile›*
