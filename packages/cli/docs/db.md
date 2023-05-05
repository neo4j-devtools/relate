`relate db`
===========

Individual databases within a DBMS.

* [`relate db create [NAME]`](#relate-db-create-name)
* [`relate db drop [NAME]`](#relate-db-drop-name)
* [`relate db dump DBMS`](#relate-db-dump-dbms)
* [`relate db exec DBMS`](#relate-db-exec-dbms)
* [`relate db list`](#relate-db-list)
* [`relate db load DBMS`](#relate-db-load-dbms)

## `relate db create [NAME]`

Create a new database in a DBMS

```
USAGE
  $ relate db create [NAME] -D <value> [-e <value>] [-u <value>]

ARGUMENTS
  NAME  database name

FLAGS
  -D, --dbms=<value>         (required) DBMS that will contain the new database (needs to be started and have an access
                             token created)
  -e, --environment=<value>  Name of the environment to run the command against
  -u, --user=<value>         [default: neo4j] The Neo4j DBMS user to create the database with (needs to have access to
                             the system database)

DESCRIPTION
  Create a new database in a DBMS

EXAMPLES
  $ relate db:create

  $ relate db:create -e environment-name

  $ relate db:create my-new-db -D started-dbms

  $ relate db:create my-new-db -D started-dbms -u dbms-user-with-system-db-access
```

## `relate db drop [NAME]`

Drop a database from a DBMS

```
USAGE
  $ relate db drop [NAME] -D <value> [-e <value>] [-u <value>]

ARGUMENTS
  NAME  database name

FLAGS
  -D, --dbms=<value>         (required) DBMS containing the database to drop (needs to be started and have an access
                             token created)
  -e, --environment=<value>  Name of the environment to run the command against
  -u, --user=<value>         [default: neo4j] The Neo4j DBMS user to drop the database with (needs to have access to the
                             system database)

DESCRIPTION
  Drop a database from a DBMS

EXAMPLES
  $ relate db:drop

  $ relate db:drop -e environment-name

  $ relate db:drop my-new-db -D started-dbms

  $ relate db:drop my-new-db -D started-dbms -u dbms-user-with-system-db-access
```

## `relate db dump DBMS`

Dump data from database

```
USAGE
  $ relate db dump DBMS [-e <value>] [-d <value>] [-t <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -d, --database=<value>     [default: neo4j] Database
  -e, --environment=<value>  Name of the environment to run the command against
  -t, --to=<value>           Path and filename for dump (defaults to a "dbmsName-db-date-time.dump")

DESCRIPTION
  Dump data from database

EXAMPLES
  $ relate db:dump

  $ relate db:dump -e environment-name

  $ relate db:dump dbms-containing-db-to-dump -d db-to-dump

  $ relate db:dump dbms-containing-db-to-dump -d db-to-dump -t /path/to/save/dump/file/to
```

## `relate db exec DBMS`

Execute a query against a database

```
USAGE
  $ relate db exec DBMS -f <value> [-e <value>] [-d <value>] [-u <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -d, --database=<value>     [default: neo4j] Database
  -e, --environment=<value>  Name of the environment to run the command against
  -f, --from=<value>         (required) Cypher file to run
  -u, --user=<value>         [default: neo4j] DBMS user

DESCRIPTION
  Execute a query against a database

EXAMPLES
  $ relate db:exec -f /path/to/cypher/file

  $ relate db:exec -f /path/to/cypher/file -e environment-name

  $ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query

  $ relate db:exec dbms-containing-db-to-query -f /path/to/cypher/file -d db-to-query --force
```

## `relate db list`

List databases within a DBMS

```
USAGE
  $ relate db list -D <value> [-e <value>] [--columns <value> | ] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml | --no-truncate | ] [--no-header | ] [-u <value>]

FLAGS
  -D, --dbms=<value>         (required) DBMS containing the databases to list (needs to be started and have an access
                             token created)
  -e, --environment=<value>  Name of the environment to run the command against
  -u, --user=<value>         [default: neo4j] The Neo4j DBMS user to list databases with (needs to have access to the
                             system database)
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  List databases within a DBMS

EXAMPLES
  $ relate db:list

  $ relate db:list -e environment-name

  $ relate db:list

  $ relate db:list --columns=name,role -u dbms-user --no-header --no-truncate

  $ relate db:list --sort=name

  $ relate db:list --filter=name=db-name --output=json
```

## `relate db load DBMS`

Load data into a database from a dump

```
USAGE
  $ relate db load DBMS -f <value> [-e <value>] [-d <value>] [--force]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -d, --database=<value>     [default: neo4j] Database to load data into
  -e, --environment=<value>  Name of the environment to run the command against
  -f, --from=<value>         (required) Dump to load data from
  --force                    Force load data (WARNING! this will erase any existing data)

DESCRIPTION
  Load data into a database from a dump

EXAMPLES
  $ relate db:load -f /path/to/dump/file

  $ relate db:load -f /path/to/dump/file -e environment-name

  $ relate db:load dbms-containing-db-to-load-into -f /path/to/dump/file -d db-to-load-into

  $ relate db:load dbms-containing-db-to-load-into -f /path/to/dump/file -d db-to-load-into --force
```
