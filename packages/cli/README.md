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
@relate/cli/1.0.2-alpha.12 linux-x64 node-v12.19.0
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

* [`relate app`](./docs/app.md) - Manage Graph Apps
* [`relate autocomplete`](./docs/autocomplete.md) - display autocomplete installation instructions
* [`relate backup`](./docs/backup.md) - Create a new backup
* [`relate db`](./docs/db.md) - Manage Neo4j Databases
* [`relate dbms`](./docs/dbms.md) - Manage Neo4j DBMSs
* [`relate environment`](./docs/environment.md) - Manage relate environments
* [`relate extension`](./docs/extension.md) - Manage relate extensions
* [`relate help`](./docs/help.md) - display help for relate
* [`relate project`](./docs/project.md) - Manage relate projects

<!-- commandsstop -->
