`daedalus db`
=============



* [`daedalus db`](#daedalus-db)
* [`daedalus db:backup [IDENTIFIERS...]`](#daedalus-dbbackup-identifiers)
* [`daedalus db:copy SOURCE DESTINATION`](#daedalus-dbcopy-source-destination)
* [`daedalus db:create NAME`](#daedalus-dbcreate-name)
* [`daedalus db:drop [IDENTIFIERS...]`](#daedalus-dbdrop-identifiers)
* [`daedalus db:exec IDENTIFIER [QUERY]`](#daedalus-dbexec-identifier-query)
* [`daedalus db:list`](#daedalus-dblist)
* [`daedalus db:list-backups [SOURCE]`](#daedalus-dblist-backups-source)
* [`daedalus db:restore SOURCE DESTINATION`](#daedalus-dbrestore-source-destination)
* [`daedalus db:start [IDENTIFIERS...]`](#daedalus-dbstart-identifiers)
* [`daedalus db:stop [IDENTIFIERS...]`](#daedalus-dbstop-identifiers)
* [`daedalus db:truncate [IDENTIFIERS...]`](#daedalus-dbtruncate-identifiers)

## `daedalus db`

```
USAGE
  $ daedalus db
```

_See code: [dist/commands/db/index.ts](dist/commands/db/index.ts)_

## `daedalus db:backup [IDENTIFIERS...]`

Backup one or more DBs.

```
USAGE
  $ daedalus db:backup [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN

OPTIONS
  -t, --target=target  Directory to store backups. Can be a path or URL.
```

_See code: [dist/commands/db/backup.ts](dist/commands/db/backup.ts)_

## `daedalus db:copy SOURCE DESTINATION`

Copy a database.

```
USAGE
  $ daedalus db:copy SOURCE DESTINATION

ARGUMENTS
  SOURCE       Name or ID of the database to copy from.
  DESTINATION  Name or ID of the destination database.
```

_See code: [dist/commands/db/copy.ts](dist/commands/db/copy.ts)_

## `daedalus db:create NAME`

Create a DB within the DBMS in use.

```
USAGE
  $ daedalus db:create NAME
```

_See code: [dist/commands/db/create.ts](dist/commands/db/create.ts)_

## `daedalus db:drop [IDENTIFIERS...]`

```
USAGE
  $ daedalus db:drop [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/db/drop.ts](dist/commands/db/drop.ts)_

## `daedalus db:exec IDENTIFIER [QUERY]`

Executes Cypher on a selected database.

```
USAGE
  $ daedalus db:exec IDENTIFIER [QUERY]

ARGUMENTS
  IDENTIFIER  Can be a name or ID.
  QUERY       The Cypher query can also be passed via STDIN.

OPTIONS
  -f, --file=file  File path to be executed.

EXAMPLE
```

_See code: [dist/commands/db/exec.ts](dist/commands/db/exec.ts)_

## `daedalus db:list`

List all available databases.

```
USAGE
  $ daedalus db:list

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
  --ids                Return only IDs. Useful for scripting.

ALIASES
  $ daedalus ls
```

_See code: [dist/commands/db/list.ts](dist/commands/db/list.ts)_

## `daedalus db:list-backups [SOURCE]`

```
USAGE
  $ daedalus db:list-backups [SOURCE]

ARGUMENTS
  SOURCE  Can be a path or url.

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
  --ids                Return only IDs. Useful for scripting.
```

_See code: [dist/commands/db/list-backups.ts](dist/commands/db/list-backups.ts)_

## `daedalus db:restore SOURCE DESTINATION`

```
USAGE
  $ daedalus db:restore SOURCE DESTINATION

ARGUMENTS
  SOURCE       Can be a path, url, or name
  DESTINATION  Name of the destination database.
```

_See code: [dist/commands/db/restore.ts](dist/commands/db/restore.ts)_

## `daedalus db:start [IDENTIFIERS...]`

Start or stop one or more databases.

```
USAGE
  $ daedalus db:start [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/db/start.ts](dist/commands/db/start.ts)_

## `daedalus db:stop [IDENTIFIERS...]`

Stop one or more databases.

```
USAGE
  $ daedalus db:stop [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/db/stop.ts](dist/commands/db/stop.ts)_

## `daedalus db:truncate [IDENTIFIERS...]`

Truncate one or more databases.

```
USAGE
  $ daedalus db:truncate [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/db/truncate.ts](dist/commands/db/truncate.ts)_
