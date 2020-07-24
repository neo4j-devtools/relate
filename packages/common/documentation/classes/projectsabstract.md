[@relate/common](../README.md) › [ProjectsAbstract](projectsabstract.md)

# Class: ProjectsAbstract ‹**Env**›

## Type parameters

▪ **Env**: *[EnvironmentAbstract](environmentabstract.md)*

## Hierarchy

* **ProjectsAbstract**

## Index

### Constructors

* [constructor](projectsabstract.md#constructor)

### Properties

* [projects](projectsabstract.md#projects)

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

## Constructors

###  constructor

\+ **new ProjectsAbstract**(`environment`: Env): *[ProjectsAbstract](projectsabstract.md)*

*Defined in [projects/projects.abstract.ts:8](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L8)*

**Parameters:**

Name | Type |
------ | ------ |
`environment` | Env |

**Returns:** *[ProjectsAbstract](projectsabstract.md)*

## Properties

###  projects

• **projects**: *object*

*Defined in [projects/projects.abstract.ts:8](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L8)*

#### Type declaration:

* \[ **id**: *string*\]: IProject

## Methods

### `Abstract` addDbms

▸ **addDbms**(`projectName`: string, `dbmsName`: string, `dbmsId`: string, `principal?`: undefined | string, `accessToken?`: undefined | string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:41](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L41)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`dbmsName` | string |
`dbmsId` | string |
`principal?` | undefined &#124; string |
`accessToken?` | undefined &#124; string |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` addFile

▸ **addFile**(`projectName`: string, `source`: string, `destination?`: undefined | string): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:25](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L25)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`source` | string |
`destination?` | undefined &#124; string |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` create

▸ **create**(`manifest`: IProjectManifest, `path?`: undefined | string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:12](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L12)*

**Parameters:**

Name | Type |
------ | ------ |
`manifest` | IProjectManifest |
`path?` | undefined &#124; string |

**Returns:** *Promise‹IProject›*

___

### `Abstract` get

▸ **get**(`name`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:14](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L14)*

**Parameters:**

Name | Type |
------ | ------ |
`name` | string |

**Returns:** *Promise‹IProject›*

___

### `Abstract` link

▸ **link**(`filePath`: string): *Promise‹IProject›*

*Defined in [projects/projects.abstract.ts:18](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L18)*

**Parameters:**

Name | Type |
------ | ------ |
`filePath` | string |

**Returns:** *Promise‹IProject›*

___

### `Abstract` list

▸ **list**(`filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProject››*

*Defined in [projects/projects.abstract.ts:16](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L16)*

**Parameters:**

Name | Type |
------ | ------ |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IProject››*

___

### `Abstract` listDbmss

▸ **listDbmss**(`projectName`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IProjectDbms››*

*Defined in [projects/projects.abstract.ts:36](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L36)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IProjectDbms››*

___

### `Abstract` listFiles

▸ **listFiles**(`projectName`: string, `filters?`: List‹IRelateFilter› | IRelateFilter[]): *Promise‹List‹IRelateFile››*

*Defined in [projects/projects.abstract.ts:20](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L20)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`filters?` | List‹IRelateFilter› &#124; IRelateFilter[] |

**Returns:** *Promise‹List‹IRelateFile››*

___

### `Abstract` removeDbms

▸ **removeDbms**(`projectName`: string, `dbmsName`: string): *Promise‹IProjectDbms›*

*Defined in [projects/projects.abstract.ts:49](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L49)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`dbmsName` | string |

**Returns:** *Promise‹IProjectDbms›*

___

### `Abstract` removeFile

▸ **removeFile**(`projectName`: string, `relativePath`: string): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:34](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L34)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`relativePath` | string |

**Returns:** *Promise‹IRelateFile›*

___

### `Abstract` writeFile

▸ **writeFile**(`projectName`: string, `destination`: string, `data`: string | Buffer, `writeFlag?`: WriteFileFlag): *Promise‹IRelateFile›*

*Defined in [projects/projects.abstract.ts:27](https://github.com/neo-technology/relate/blob/master/packages/common/src/entities/projects/projects.abstract.ts#L27)*

**Parameters:**

Name | Type |
------ | ------ |
`projectName` | string |
`destination` | string |
`data` | string &#124; Buffer |
`writeFlag?` | WriteFileFlag |

**Returns:** *Promise‹IRelateFile›*
