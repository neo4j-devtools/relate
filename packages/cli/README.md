# @relate/cli

CLI tool for interacting with the Neo4j platform.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/cli)
[![Downloads/week](https://img.shields.io/npm/dw/cli.svg)](https://npmjs.org/package/cli)
[![License](https://img.shields.io/npm/l/cli.svg)](https://github.com/neo-technology/relate/blob/master/package.json)

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
@relate/cli/1.0.1-alpha.6 darwin-x64 node-v12.13.1
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
daedalus$ cd packages/cli
cli$ npm run build
cli$ ./bin/run --help
```

Or link the entire repository and have access to the `relate` command globally.

```shell
daedalus$ npm link
daedalus$ relate --help
```

# Commands

<!-- commands -->
# Command Topics

* [`relate app`](./docs/app.md) - Manage Graph Apps
* [`relate autocomplete`](./docs/autocomplete.md) - display autocomplete installation instructions
* [`relate db`](./docs/db.md) - Manage Neo4j Databases
* [`relate dbms`](./docs/dbms.md) - Manage Neo4j DBMSs
* [`relate environment`](./docs/environment.md) - Manage relate environments
* [`relate extension`](./docs/extension.md) - Manage relate extensions
* [`relate help`](./docs/help.md) - display help for relate
* [`relate project`](./docs/project.md) - Manage relate projects

<!-- commandsstop -->
