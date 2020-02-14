# @relate/cli

CLI tool for interacting with the Neo4j platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/neo-technology/daedalus/blob/master/package.json)

<!-- toc -->

-   [Usage](#usage)
-   [Commands](#commands)
    <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @relate/cli
$ relate COMMAND
running command...
$ daedalus (-v|--version|version)
@daedalus/cli/0.0.0 linux-x64 node-v12.15.0
$ daedalus --help [COMMAND]
USAGE
  $ relate COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->
* [`daedalus dbms:start [DBMSIDS]`](#daedalus-dbmsstart-dbmsids)
* [`daedalus dbms:status [DBMSIDS]`](#daedalus-dbmsstatus-dbmsids)
* [`daedalus dbms:stop [DBMSIDS]`](#daedalus-dbmsstop-dbmsids)
* [`daedalus hello [FILE]`](#daedalus-hello-file)
* [`daedalus help [COMMAND]`](#daedalus-help-command)

## `daedalus dbms:start [DBMSIDS]`

```
USAGE
  $ daedalus dbms:start [DBMSIDS]
```

_See code: [dist/commands/dbms/start.ts](https://github.com/neo-technology/daedalus/blob/v0.0.0/dist/commands/dbms/start.ts)_

## `daedalus dbms:status [DBMSIDS]`

```
USAGE
  $ daedalus dbms:status [DBMSIDS]
```

_See code: [dist/commands/dbms/status.ts](https://github.com/neo-technology/daedalus/blob/v0.0.0/dist/commands/dbms/status.ts)_

## `daedalus dbms:stop [DBMSIDS]`

```
USAGE
  $ daedalus dbms:stop [DBMSIDS]
```

_See code: [dist/commands/dbms/stop.ts](https://github.com/neo-technology/daedalus/blob/v0.0.0/dist/commands/dbms/stop.ts)_

## `daedalus hello [FILE]`

describe the command here

```
USAGE
  $ relate hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ daedalus hello
  hello world from ./src/hello.ts!
```

_See code: [dist/commands/hello.ts](https://github.com/neo-technology/daedalus/blob/v0.0.0/dist/commands/hello.ts)_

## `daedalus help [COMMAND]`

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
