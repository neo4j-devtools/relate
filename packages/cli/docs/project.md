`relate project`
================

Manage relate projects

* [`relate project:add-dbms DBMS`](#relate-projectadd-dbms-dbms)
* [`relate project:add-file SOURCE`](#relate-projectadd-file-source)
* [`relate project:init TARGETDIR`](#relate-projectinit-targetdir)
* [`relate project:link [FILEPATH]`](#relate-projectlink-filepath)
* [`relate project:list`](#relate-projectlist)
* [`relate project:list-dbmss`](#relate-projectlist-dbmss)
* [`relate project:list-files`](#relate-projectlist-files)
* [`relate project:open NAME`](#relate-projectopen-name)
* [`relate project:remove-dbms DBMS`](#relate-projectremove-dbms-dbms)
* [`relate project:remove-file FILE`](#relate-projectremove-file-file)

## `relate project:add-dbms DBMS`

Adds a dbms to a project

```
USAGE
  $ relate project:add-dbms DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -n, --name=name                Project DBMS name
  -p, --project=project          (required) Name of the project to run the command against
  -u, --user=user                [default: neo4j] Neo4j DBMS user to create the token for
```

_See code: [dist/commands/project/add-dbms.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/add-dbms.ts)_

## `relate project:add-file SOURCE`

Adds a file to a project

```
USAGE
  $ relate project:add-file SOURCE

OPTIONS
  -d, --destination=destination  The relative path of the file (including name) in the project
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/add-file.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/add-file.ts)_

## `relate project:init TARGETDIR`

Create a new project

```
USAGE
  $ relate project:init TARGETDIR

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  --name=name                    (required) Name of the project to initialize
```

_See code: [dist/commands/project/init.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/init.ts)_

## `relate project:link [FILEPATH]`

Link a project (useful for development)

```
USAGE
  $ relate project:link [FILEPATH]
```

_See code: [dist/commands/project/link.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/link.ts)_

## `relate project:list`

Lists all projects

```
USAGE
  $ relate project:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
```

_See code: [dist/commands/project/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/list.ts)_

## `relate project:list-dbmss`

Lists project dbmss

```
USAGE
  $ relate project:list-dbmss

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/list-dbmss.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/list-dbmss.ts)_

## `relate project:list-files`

Lists project files

```
USAGE
  $ relate project:list-files

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/list-files.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/list-files.ts)_

## `relate project:open NAME`

Opens a project folder

```
USAGE
  $ relate project:open NAME

OPTIONS
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/open.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/open.ts)_

## `relate project:remove-dbms DBMS`

Removes a dbms from a project

```
USAGE
  $ relate project:remove-dbms DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/remove-dbms.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/remove-dbms.ts)_

## `relate project:remove-file FILE`

Removes a file from a project

```
USAGE
  $ relate project:remove-file FILE

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against
```

_See code: [dist/commands/project/remove-file.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/project/remove-file.ts)_
