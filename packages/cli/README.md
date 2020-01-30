@daedalus/cli
===

CLI tool for interacting with the Neo4j platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/neo-technology/daedalus/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @daedalus/cli
$ daedalus COMMAND
running command...
$ daedalus (-v|--version|version)
@daedalus/cli/0.0.0 darwin-x64 node-v12.14.1
$ daedalus --help [COMMAND]
USAGE
  $ daedalus COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`daedalus hello [FILE]`](#daedalus-hello-file)
* [`daedalus help [COMMAND]`](#daedalus-help-command)

## `daedalus hello [FILE]`

describe the command here

```
USAGE
  $ daedalus hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ daedalus hello
  hello world from ./src/hello.ts!
```

## `daedalus help [COMMAND]`

display help for daedalus

```
USAGE
  $ daedalus help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.3/src/commands/help.ts)_
<!-- commandsstop -->
