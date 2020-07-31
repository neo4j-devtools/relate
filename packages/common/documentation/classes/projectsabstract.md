[@relate/common](../README.md) › [ProjectsAbstract](projectsabstract.md)

# Class: ProjectsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **ProjectsAbstract**

## Index

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

## Methods

### `Abstract` addDbms

▸ **addDbms**(`projectId`: string, `dbmsName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:100](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L100)*

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

▸ **addFile**(`projectId`: string, `source`: string, `destination?`: undefined | string): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:59](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L59)*

Adds file (copy) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`source` | string | - |
`destination?` | undefined &#124; string |   |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` create

▸ **create**(`manifest`: IProjectInput, `path?`: undefined | string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:23](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L23)*

Creates new project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`manifest` | IProjectInput | Project data |
`path?` | undefined &#124; string | Path to project root  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` get

▸ **get**(`nameOrID`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:29](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L29)*

Gets a project by name

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`nameOrID` | string |   |

**Returns:** *Promise‹IProject›*

___

### `Abstract` link

▸ **link**(`filePath`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:41](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L41)*

Links an existing project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filePath` | string | Path to project root  |

**Returns:** *Promise‹IProject›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProject››*

*Defined in [projects/projects.abstract.ts:35](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L35)*

List all available projects

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] | Filters to apply  |

**Returns:** *Promise‹List‹IProject››*

___

### `Abstract` listDbmss

▸ **listDbmss**(`projectId`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProjectDbms››*

*Defined in [projects/projects.abstract.ts:87](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L87)*

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

*Defined in [projects/projects.abstract.ts:48](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L48)*

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

*Defined in [projects/projects.abstract.ts:113](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L113)*

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

*Defined in [projects/projects.abstract.ts:80](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L80)*

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

*Defined in [projects/projects.abstract.ts:68](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L68)*

Adds file (write) to project

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`projectId` | string | - |
`destination` | string | - |
`data` | string &#124; Buffer | - |
`writeFlag?` | WriteFileFlag |   |

**Returns:** *Promise‹IRelateFile›*
