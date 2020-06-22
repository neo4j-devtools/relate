`relate db`
===========

Manage Neo4j Databases

* [`relate db:create NAME`](#relate-dbcreate-name)
* [`relate db:drop [NAME]`](#relate-dbdrop-name)
* [`relate db:list`](#relate-dblist)

## `relate db:create NAME`

Create a new database

```
USAGE
  $ relate db:create NAME

ARGUMENTS
  NAME  database name

OPTIONS
  -D, --dbms=dbms                (required) DBMS that will contain the new database
  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to create the database with (needs to have access
                                 to the system database)
```

_See code: [dist/commands/db/create.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/db/create.ts)_

## `relate db:drop [NAME]`

Drop a database

```
USAGE
  $ relate db:drop [NAME]

ARGUMENTS
  NAME  database name

OPTIONS
  -D, --dbms=dbms                (required) DBMS containing the database to drop
  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to drop the database with (needs to have access to
                                 the system database)
```

_See code: [dist/commands/db/drop.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/db/drop.ts)_

## `relate db:list`

List a database

```
USAGE
  $ relate db:list

OPTIONS
  -D, --dbms=dbms                (required) DBMS containing the databases to list
  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to list databases with (needs to have access to
                                 the system database)

  --columns=columns              only show provided columns (comma-separated)

  --filter=filter                filter property by partial string matching, ex: name=foo

  --no-header                    hide table header from output

  --no-truncate                  do not truncate output to fit screen

  --output=csv|json|yaml         output in a more machine friendly format

  --sort=sort                    property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/db/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/db/list.ts)_
