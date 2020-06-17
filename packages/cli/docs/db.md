`relate db`
===========

Manage Neo4j Databases

* [`relate db:create [NAME]`](#relate-dbcreate-name)

## `relate db:create [NAME]`

Create a new database

```
USAGE
  $ relate db:create [NAME]

ARGUMENTS
  NAME  database name

OPTIONS
  -D, --dbms=dbms                (required) DBMS to create database in
  -e, --environment=environment  Name of the environment to run the command against

  -u, --user=user                [default: neo4j] The Neo4j DBMS user to create the database with (needs to have access
                                 to the system database)
```

_See code: [dist/commands/db/create.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/db/create.ts)_
