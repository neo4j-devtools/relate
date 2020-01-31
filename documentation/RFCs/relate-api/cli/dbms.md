`daedalus dbms`
===============



* [`daedalus dbms`](#daedalus-dbms)
* [`daedalus dbms:clone IDENTIFIER PATH`](#daedalus-dbmsclone-identifier-path)
* [`daedalus dbms:create NAME`](#daedalus-dbmscreate-name)
* [`daedalus dbms:current`](#daedalus-dbmscurrent)
* [`daedalus dbms:delete [IDENTIFIERS...]`](#daedalus-dbmsdelete-identifiers)
* [`daedalus dbms:edit-config`](#daedalus-dbmsedit-config)
* [`daedalus dbms:list`](#daedalus-dbmslist)
* [`daedalus dbms:logs`](#daedalus-dbmslogs)
* [`daedalus dbms:new-password`](#daedalus-dbmsnew-password)
* [`daedalus dbms:start [IDENTIFIERS...]`](#daedalus-dbmsstart-identifiers)
* [`daedalus dbms:stop [IDENTIFIERS...]`](#daedalus-dbmsstop-identifiers)
* [`daedalus dbms:upgrade [IDENTIFIERS...]`](#daedalus-dbmsupgrade-identifiers)
* [`daedalus dbms:use IDENTIFIER`](#daedalus-dbmsuse-identifier)

## `daedalus dbms`

```
USAGE
  $ daedalus dbms
```

_See code: [dist/commands/dbms/index.ts](dist/commands/dbms/index.ts)_

## `daedalus dbms:clone IDENTIFIER PATH`

Clone a DBMS to the specified path.

```
USAGE
  $ daedalus dbms:clone IDENTIFIER PATH

ARGUMENTS
  IDENTIFIER  It can be a name or ID.
  PATH        It can be a filepath or URL.

EXAMPLES
  $ deadalus dbms:clone MyDBMS ./path/to/dbms
  $ deadalus dbms:clone MyDBMS https://myhosted.dbms
```

_See code: [dist/commands/dbms/clone.ts](dist/commands/dbms/clone.ts)_

## `daedalus dbms:create NAME`

Create a new DBMS.

```
USAGE
  $ daedalus dbms:create NAME

OPTIONS
  -s, --source=source  DBMS version, path to DBMS archive, or URL.
```

_See code: [dist/commands/dbms/create.ts](dist/commands/dbms/create.ts)_

## `daedalus dbms:current`

Return information about the DBMS in use.

```
USAGE
  $ daedalus dbms:current

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
```

_See code: [dist/commands/dbms/current.ts](dist/commands/dbms/current.ts)_

## `daedalus dbms:delete [IDENTIFIERS...]`

Delete one or more DBMSs.

```
USAGE
  $ daedalus dbms:delete [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN

ALIASES
  $ daedalus rm
```

_See code: [dist/commands/dbms/delete.ts](dist/commands/dbms/delete.ts)_

## `daedalus dbms:edit-config`

Edit the configuration for the DBMS in use.

```
USAGE
  $ daedalus dbms:edit-config
```

_See code: [dist/commands/dbms/edit-config.ts](dist/commands/dbms/edit-config.ts)_

## `daedalus dbms:list`

List available DBMSs.

```
USAGE
  $ daedalus dbms:list

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
  --ids                Return only IDs. Useful for scripting.

ALIASES
  $ daedalus ls
```

_See code: [dist/commands/dbms/list.ts](dist/commands/dbms/list.ts)_

## `daedalus dbms:logs`

Show logs from the DBMS in use.

```
USAGE
  $ daedalus dbms:logs

OPTIONS
  -F, --filter=filter
```

_See code: [dist/commands/dbms/logs.ts](dist/commands/dbms/logs.ts)_

## `daedalus dbms:new-password`

Change password for the DBMS in use.

```
USAGE
  $ daedalus dbms:new-password
```

_See code: [dist/commands/dbms/new-password.ts](dist/commands/dbms/new-password.ts)_

## `daedalus dbms:start [IDENTIFIERS...]`

Start one or more DBMSs.

```
USAGE
  $ daedalus dbms:start [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/dbms/start.ts](dist/commands/dbms/start.ts)_

## `daedalus dbms:stop [IDENTIFIERS...]`

Stop one or more DBMSs.

```
USAGE
  $ daedalus dbms:stop [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN
```

_See code: [dist/commands/dbms/stop.ts](dist/commands/dbms/stop.ts)_

## `daedalus dbms:upgrade [IDENTIFIERS...]`

Upgrade one or more DBMSs.

```
USAGE
  $ daedalus dbms:upgrade [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN

OPTIONS
  -s, --source=source  DBMS version, path to DBMS archive, or URL.
```

_See code: [dist/commands/dbms/upgrade.ts](dist/commands/dbms/upgrade.ts)_

## `daedalus dbms:use IDENTIFIER`

Select a DBMS to use.

```
USAGE
  $ daedalus dbms:use IDENTIFIER

ARGUMENTS
  IDENTIFIER  Identifier can be a name or ID.
```

_See code: [dist/commands/dbms/use.ts](dist/commands/dbms/use.ts)_
