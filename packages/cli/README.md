# @relate/cli

CLI tool for interacting with the Neo4j platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/@relate/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@relate/cli.svg)](https://npmjs.com/package/@relate/cli)
[![License](https://img.shields.io/npm/l/@relate/cli.svg)](https://github.com/neo4j-devtools/relate/blob/master/package.json)

- [@relate/cli](#relatecli)
- [Usage](#usage)
- [Commands](#commands)
- [Command Topics](#command-topics)

# Usage

<!-- usage -->
```sh-session
$ npm install -g @relate/cli
$ relate COMMAND
running command...
$ relate (-v|--version|version)
@relate/cli/1.0.2-alpha.15 linux-x64 node-v12.19.0
$ relate --help [COMMAND]
USAGE
  $ relate COMMAND
...
```
<!-- usagestop -->

# Development

To to run the CLI while developing, you can either execute the run script on the
`cli` package

```shell
relate$ cd packages/cli
cli$ npm run build
cli$ ./bin/run --help
```

Or link the entire repository and have access to the `relate` command globally.

```shell
relate$ npm link
relate$ relate --help
```

# Commands

<!-- commands -->
# Command Topics

* [`relate app`](./docs/app.md) - Single page web apps.
* [`relate autocomplete`](./docs/autocomplete.md) - display autocomplete installation instructions
* [`relate backup`](./docs/backup.md) - Archives of Relate-managed resources (though not Neo4j databases; see "db:dump").
* [`relate db`](./docs/db.md) - Individual databases within a DBMS.
* [`relate dbms`](./docs/dbms.md) - Neo4j DBMS installations.
* [`relate environment`](./docs/environment.md) - Managed sets of related resources and services, which may be local or remote.
* [`relate extension`](./docs/extension.md) - Extensions to the Relate framework.
* [`relate help`](./docs/help.md) - display help for relate
* [`relate project`](./docs/project.md) - Projects bring files and data together.

<!-- commandsstop -->
