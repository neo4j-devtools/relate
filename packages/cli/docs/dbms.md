`relate dbms`
=============

Manage Neo4j DBMSs

* [`relate dbms:access-token DBMS`](#relate-dbmsaccess-token-dbms)
* [`relate dbms:info [DBMSS]`](#relate-dbmsinfo-dbmss)
* [`relate dbms:install VERSION`](#relate-dbmsinstall-version)
* [`relate dbms:list`](#relate-dbmslist)
* [`relate dbms:open DBMS`](#relate-dbmsopen-dbms)
* [`relate dbms:start [DBMSS]`](#relate-dbmsstart-dbmss)
* [`relate dbms:stop [DBMSS]`](#relate-dbmsstop-dbmss)
* [`relate dbms:uninstall DBMS`](#relate-dbmsuninstall-dbms)

## `relate dbms:access-token DBMS`

Generate access token for a Neo4j DBMS

```
USAGE
  $ relate dbms:access-token DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -c, --credentials=credentials  (required)
  -e, --environment=environment  Name of the environment to run the command against
  -u, --user=user                [default: neo4j] Neo4j DBMS user to create the token for
```

_See code: [dist/commands/dbms/access-token.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/access-token.ts)_

## `relate dbms:info [DBMSS]`

Show the status of one or more Neo4j DBMSs

```
USAGE
  $ relate dbms:info [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/dbms/info.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/info.ts)_

## `relate dbms:install VERSION`

Install a Neo4j DBMS in the selected environment

```
USAGE
  $ relate dbms:install VERSION

ARGUMENTS
  VERSION  Version to install (semver, url, or path)

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -n, --name=name                (required) Name to give the newly installed DBMS
```

_See code: [dist/commands/dbms/install.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/install.ts)_

## `relate dbms:list`

List available Neo4j DBMSs in the selected environment

```
USAGE
  $ relate dbms:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/dbms/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/list.ts)_

## `relate dbms:open DBMS`

Open a Neo4j DBMS's directory

```
USAGE
  $ relate dbms:open DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against
```

_See code: [dist/commands/dbms/open.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/open.ts)_

## `relate dbms:start [DBMSS]`

Start one or more Neo4j DBMSs

```
USAGE
  $ relate dbms:start [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
```

_See code: [dist/commands/dbms/start.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/start.ts)_

## `relate dbms:stop [DBMSS]`

Stop one or more Neo4j DBMSs

```
USAGE
  $ relate dbms:stop [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
```

_See code: [dist/commands/dbms/stop.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/stop.ts)_

## `relate dbms:uninstall DBMS`

Uninstall a Neo4j DBMS from the selected environment

```
USAGE
  $ relate dbms:uninstall DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
```

_See code: [dist/commands/dbms/uninstall.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/dbms/uninstall.ts)_
