# @relate/cli

CLI tool for interacting with the Neo4j platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/neo-technology/daedalus/blob/master/package.json)

<!-- toc -->
* [@relate/cli](#relatecli)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @relate/cli
$ relate COMMAND
running command...
$ relate (-v|--version|version)
@relate/cli/1.0.0 linux-x64 node-v12.16.0
$ relate --help [COMMAND]
USAGE
  $ relate COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`relate dbms:access-token [DBMSID]`](#relate-dbmsaccess-token-dbmsid)
* [`relate dbms:list`](#relate-dbmslist)
* [`relate dbms:start [DBMSIDS]`](#relate-dbmsstart-dbmsids)
* [`relate dbms:status [DBMSIDS]`](#relate-dbmsstatus-dbmsids)
* [`relate dbms:stop [DBMSIDS]`](#relate-dbmsstop-dbmsids)
* [`relate help [COMMAND]`](#relate-help-command)

## `relate dbms:access-token [DBMSID]`

```
USAGE
  $ relate dbms:access-token [DBMSID]

OPTIONS
  -c, --credentials=credentials
  -p, --principal=principal
```

_See code: [dist/commands/dbms/access-token.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/dbms/access-token.ts)_

## `relate dbms:list`

```
USAGE
  $ relate dbms:list

ALIASES
  $ relate ls
```

_See code: [dist/commands/dbms/list.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/dbms/list.ts)_

## `relate dbms:start [DBMSIDS]`

```
USAGE
  $ relate dbms:start [DBMSIDS]
```

_See code: [dist/commands/dbms/start.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/dbms/start.ts)_

## `relate dbms:status [DBMSIDS]`

```
USAGE
  $ relate dbms:status [DBMSIDS]

OPTIONS
  -x, --extended          show extra columns
  --columns=columns       only show provided columns (comma-separated)
  --csv                   output is csv format [alias: --output=csv]
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [dist/commands/dbms/status.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/dbms/status.ts)_

## `relate dbms:stop [DBMSIDS]`

```
USAGE
  $ relate dbms:stop [DBMSIDS]
```

_See code: [dist/commands/dbms/stop.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/dbms/stop.ts)_

## `relate help [COMMAND]`

display help for relate

```
USAGE
  $ relate help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
