`relate dbms`
=============

Manage Neo4j DBMSs

* [`relate dbms:access-token DBMS`](#relate-dbmsaccess-token-dbms)
* [`relate dbms:info [DBMSS]`](#relate-dbmsinfo-dbmss)
* [`relate dbms:install VERSION`](#relate-dbmsinstall-version)
* [`relate dbms:link FILEPATH DBMSNAME`](#relate-dbmslink-filepath-dbmsname)
* [`relate dbms:list`](#relate-dbmslist)
* [`relate dbms:open DBMS`](#relate-dbmsopen-dbms)
* [`relate dbms:start [DBMSS]`](#relate-dbmsstart-dbmss)
* [`relate dbms:stop [DBMSS]`](#relate-dbmsstop-dbmss)
* [`relate dbms:uninstall DBMS`](#relate-dbmsuninstall-dbms)

## `relate dbms:access-token DBMS`

Generate access token for a Neo4j >=4.x enterprise DBMS

```
USAGE
  $ relate dbms:access-token DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -u, --user=user                [default: neo4j] Neo4j DBMS user to create the token for

EXAMPLES
  $ relate dbms:access-token
  $ relate dbms:access-token -e environment-name
  $ relate dbms:access-token my-dbms
  $ relate dbms:access-token my-dbms -u dbms-user
```

_See code: [dist/commands/dbms/access-token.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/access-token.ts)_

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

EXAMPLES
  $ relate dbms:info
  $ relate dbms:info -e environment-name
  $ relate dbms:info -x
  $ relate dbms:info --columns=id,name --no-header --no-truncate
  $ relate dbms:info --sort=name
  $ relate dbms:info --filter=name=my-dbms --output=json
```

_See code: [dist/commands/dbms/info.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/info.ts)_

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
  --limited                      Display limited versions of DBMSs
  --no-caching                   Prevent caching of the downloaded DBMS

EXAMPLES
  $ relate dbms:install
  $ relate dbms:install --limited
  $ relate dbms:install -n my-new-dbms
  $ relate dbms:install 4.0.2 -n my-new-dbms
  $ relate dbms:install 4.0.2 -n my-new-dbms -e environment-name --no-caching
```

_See code: [dist/commands/dbms/install.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/install.ts)_

## `relate dbms:link FILEPATH DBMSNAME`

Link an existing DBMS (useful for development)

```
USAGE
  $ relate dbms:link FILEPATH DBMSNAME

OPTIONS
  -y, --confirm=confirm  (required) Confirm DBMS configuration changes

EXAMPLE
  $ relate dbms:link /path/to/target/dbms/dir "foo bar"
```

_See code: [dist/commands/dbms/link.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/link.ts)_

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

EXAMPLES
  $ relate dbms:list
  $ relate dbms:list -e environment-name
  $ relate dbms:list --columns=id,name --no-header --no-truncate
  $ relate dbms:list --sort=name
  $ relate dbms:list --filter=name=my-dbms --output=json
```

_See code: [dist/commands/dbms/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/list.ts)_

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

EXAMPLES
  $ relate dbms:open
  $ relate dbms:open -e environment-name
  $ relate dbms:open -L
```

_See code: [dist/commands/dbms/open.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/open.ts)_

## `relate dbms:start [DBMSS]`

Start one or more Neo4j DBMSs

```
USAGE
  $ relate dbms:start [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate dbms:start
  $ relate dbms:start my-dbms
  $ relate dbms:start my-dbms my-other-dbms
  $ relate dbms:start -e environment-name
```

_See code: [dist/commands/dbms/start.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/start.ts)_

## `relate dbms:stop [DBMSS]`

Stop one or more Neo4j DBMSs

```
USAGE
  $ relate dbms:stop [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate dbms:stop
  $ relate dbms:stop my-dbms
  $ relate dbms:stop my-dbms my-other-dbms
  $ relate dbms:stop -e environment-name
```

_See code: [dist/commands/dbms/stop.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/stop.ts)_

## `relate dbms:uninstall DBMS`

Uninstall a Neo4j DBMS from the selected environment

```
USAGE
  $ relate dbms:uninstall DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate dbms:uninstall
  $ relate dbms:uninstall -e environment-name
  $ relate dbms:uninstall my-dbms
  $ relate dbms:uninstall my-dbms -u dbms-user
```

_See code: [dist/commands/dbms/uninstall.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.6/dist/commands/dbms/uninstall.ts)_
