`relate db`
===========

Individual databases within a DBMS.

* [`relate db:create NAME`](#relate-dbcreate-name)
* [`relate db:drop [NAME]`](#relate-dbdrop-name)
* [`relate db:dump DBMS`](#relate-dbdump-dbms)
* [`relate db:exec DBMS`](#relate-dbexec-dbms)
* [`relate db:list`](#relate-dblist)
* [`relate db:load DBMS`](#relate-dbload-dbms)

## `relate db:create NAME`

Create a new database in a DBMS

```
USAGE
  $ relate db:create NAME

ARGUMENTS
  NAME  database name

OPTIONS
  -D, --dbms=dbms                (required) DBMS that will contain the new database (needs to be started and have an
                                 access token created)

  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to create the database with (needs to have access
                                 to the system database)

EXAMPLES
  $ relate db:create
  $ relate db:create -e environment-name
  $ relate db:create my-new-db -D started-dbms
  $ relate db:create my-new-db -D started-dbms -u dbms-user-with-system-db-access
```

_See code: [dist/commands/db/create.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/create.ts)_

## `relate db:drop [NAME]`

Drop a database from a DBMS

```
USAGE
  $ relate db:drop [NAME]

ARGUMENTS
  NAME  database name

OPTIONS
  -D, --dbms=dbms                (required) DBMS containing the database to drop (needs to be started and have an access
                                 token created)

  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to drop the database with (needs to have access to
                                 the system database)

EXAMPLES
  $ relate db:drop
  $ relate db:drop -e environment-name
  $ relate db:drop my-new-db -D started-dbms
  $ relate db:drop my-new-db -D started-dbms -u dbms-user-with-system-db-access
```

_See code: [dist/commands/db/drop.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/drop.ts)_

## `relate db:dump DBMS`

Dump data from database

```
USAGE
  $ relate db:dump DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -d, --database=database        [default: neo4j] Database
  -e, --environment=environment  Name of the environment to run the command against
  -t, --to=to                    Path and filename for dump (defaults to a "dbmsName-db-date-time.dump")

EXAMPLES
  $ relate db:dump
  $ relate db:dump -e environment-name
  $ relate db:dump dbms-containing-db-to-dump -d db-to-dump
  $ relate db:dump dbms-containing-db-to-dump -d db-to-dump -t /path/to/save/dump/file/to
```

_See code: [dist/commands/db/dump.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/dump.ts)_

## `relate db:exec DBMS`

Execute a query against a database

```
USAGE
  $ relate db:exec DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -d, --database=database        [default: neo4j] Database
  -e, --environment=environment  Name of the environment to run the command against
  -f, --from=from                (required) Cypher file to run
  -u, --user=user                [default: neo4j] DBMS user

EXAMPLES
  $ relate db:exec -f /path/to/cypher/file
  $ relate db:exec -f /path/to/cypher/file -e environment-name
  $ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query
  $ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query --force
```

_See code: [dist/commands/db/exec.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/exec.ts)_

## `relate db:list`

List databases within a DBMS

```
USAGE
  $ relate db:list

OPTIONS
  -D, --dbms=dbms                (required) DBMS containing the databases to list (needs to be started and have an
                                 access token created)

  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to list databases with (needs to have access to
                                 the system database)

  --columns=columns              only show provided columns (comma-separated)

  --filter=filter                filter property by partial string matching, ex: name=foo

  --no-header                    hide table header from output

  --no-truncate                  do not truncate output to fit screen

  --output=csv|json|yaml         output in a more machine friendly format

  --sort=sort                    property to sort by (prepend '-' for descending)

EXAMPLES
  $ relate db:list
  $ relate db:list -e environment-name
  $ relate db:list
  $ relate db:list --columns=name,role -u dbms-user --no-header --no-truncate
  $ relate db:list --sort=name
  $ relate db:list --filter=name=db-name --output=json
```

_See code: [dist/commands/db/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/list.ts)_

## `relate db:load DBMS`

Load data into a database from a dump

```
USAGE
  $ relate db:load DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -d, --database=database        [default: neo4j] Database to load data into
  -e, --environment=environment  Name of the environment to run the command against
  -f, --from=from                (required) Dump to load data from
  --force                        Force load data (WARNING! this will erase any existing data)

EXAMPLES
  $ relate db:load -f /path/to/dump/file
  $ relate db:load -f /path/to/dump/file -e environment-name
  $ relate db:load dbms-containing-db-to-load-into -f /path/to/dump/file -d db-to-load-into
  $ relate db:load dbms-containing-db-to-load-into -f /path/to/dump/file -d db-to-load-into --force
```

_See code: [dist/commands/db/load.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/db/load.ts)_
