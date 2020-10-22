`relate project`
================

Projects bring files and data together.

* [`relate project:add-dbms DBMS`](#relate-projectadd-dbms-dbms)
* [`relate project:add-file SOURCE`](#relate-projectadd-file-source)
* [`relate project:init TARGETDIR`](#relate-projectinit-targetdir)
* [`relate project:link FILEPATH`](#relate-projectlink-filepath)
* [`relate project:list`](#relate-projectlist)
* [`relate project:list-dbmss`](#relate-projectlist-dbmss)
* [`relate project:list-files`](#relate-projectlist-files)
* [`relate project:open`](#relate-projectopen)
* [`relate project:remove-dbms DBMS`](#relate-projectremove-dbms-dbms)
* [`relate project:remove-file FILE`](#relate-projectremove-file-file)

## `relate project:add-dbms DBMS`

Add a DBMS connection to a project

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

EXAMPLES
  $ relate project:add-dbms
  $ relate project:add-dbms -e environment-name
  $ relate project:add-dbms -p my-project
  $ relate project:add-dbms -p my-project -n dbms-name-in-project -u dbms-user-to-create-token-for
```

_See code: [dist/commands/project/add-dbms.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/add-dbms.ts)_

## `relate project:add-file SOURCE`

Add a file to a project

```
USAGE
  $ relate project:add-file SOURCE

OPTIONS
  -d, --destination=destination  The relative path of the file (including name) in the project
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

DESCRIPTION
  Useful for remote environments.

EXAMPLES
  $ relate project:add-file
  $ relate project:add-file -e environment-name
  $ relate project:add-file -p my-project -d /path/to/name.file
```

_See code: [dist/commands/project/add-file.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/add-file.ts)_

## `relate project:init TARGETDIR`

Initialize a new project

```
USAGE
  $ relate project:init TARGETDIR

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  --name=name                    (required) Name of the project to initialize

EXAMPLES
  $ relate project:init /path/to/target/project/dir
  $ relate project:init /path/to/target/project/dir -e environment-name
  $ relate project:init /path/to/target/project/dir --name=my-project
```

_See code: [dist/commands/project/init.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/init.ts)_

## `relate project:link FILEPATH`

Link a project

```
USAGE
  $ relate project:link FILEPATH

EXAMPLE
  $ relate project:link /path/to/target/project/dir
```

_See code: [dist/commands/project/link.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/link.ts)_

## `relate project:list`

List all projects

```
USAGE
  $ relate project:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate project:list
  $ relate project:list -e environment-name
```

_See code: [dist/commands/project/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/list.ts)_

## `relate project:list-dbmss`

List project DBMS connections

```
USAGE
  $ relate project:list-dbmss

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

EXAMPLES
  $ relate project:list-dbmss
  $ relate project:list-dbmss -e environment-name
  $ relate project:list-dbmss -p my-project
```

_See code: [dist/commands/project/list-dbmss.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/list-dbmss.ts)_

## `relate project:list-files`

List project files

```
USAGE
  $ relate project:list-files

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

EXAMPLES
  $ relate project:list-files
  $ relate project:list-files -e environment-name
  $ relate project:list-files -p my-project
```

_See code: [dist/commands/project/list-files.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/list-files.ts)_

## `relate project:open`

Open a project's folder

```
USAGE
  $ relate project:open

OPTIONS
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

EXAMPLES
  $ relate project:open
  $ relate project:open -e environment-name
  $ relate project:open -p my-project
  $ relate project:open -p my-project -L
```

_See code: [dist/commands/project/open.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/open.ts)_

## `relate project:remove-dbms DBMS`

Remove a DBMS connection from a project

```
USAGE
  $ relate project:remove-dbms DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

EXAMPLES
  $ relate project:remove-dbms
  $ relate project:remove-dbms -e environment-name
  $ relate project:remove-dbms project-dbms-name
  $ relate project:remove-dbms project-dbms-name -p my-project
```

_See code: [dist/commands/project/remove-dbms.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/remove-dbms.ts)_

## `relate project:remove-file FILE`

Remove a file from a project

```
USAGE
  $ relate project:remove-file FILE

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          (required) Name of the project to run the command against

EXAMPLES
  $ relate project:remove-file
  $ relate project:remove-file -e environment-name
  $ relate project:remove-file /project/path/to/name.file
  $ relate project:remove-file /project/path/to/name.file -p my-project
```

_See code: [dist/commands/project/remove-file.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/project/remove-file.ts)_
