# [@relate](../../README.md)/cli

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/cli.svg)](https://npmjs.org/package/@relate/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@relate/cli.svg)](https://npmjs.com/package/@relate/cli)
[![License](https://img.shields.io/npm/l/@relate/cli.svg)](https://github.com/neo4j-devtools/relate/blob/master/package.json)

CLI tool for interacting with the Neo4j platform.

# Installing

Run these commands to install and set up your first Relate environment.

```
$ npm install -g @relate/cli
$ relate env:init development --use
```

In the second command you can replace `development` with any name you want to
use for your environment.

The `--use` flag is required to set the environment as active right after it's
created. This means that if you don't provide an `--environment=<name>` flag to
following commands, Relate will default to using the environment you just
created.

The `env:init` command will download the Java distribution required to run
Neo4j, if this wasn't already done previously. If you wish to use the Java
distribution installed in your system you can provide the `--noRuntime` flag.

# Documentation

The following commands can be used to get more information about topics,
commands, flags, and arguments available, and how to use them.

```
$ relate --help
$ relate <topic> --help
$ relate <topic>:<command> --help
```

<!-- commands -->
# Command Topics

* [`relate app`](./docs/app.md) - Open app using your default web browser.
* [`relate autocomplete`](./docs/autocomplete.md) - display autocomplete installation instructions
* [`relate backup`](./docs/backup.md) - Archives of Relate-managed resources (though not Neo4j databases; see "db:dump").
* [`relate db`](./docs/db.md) - Individual databases within a DBMS.
* [`relate dbms`](./docs/dbms.md) - Neo4j DBMS installations.
* [`relate dbms-plugin`](./docs/dbms-plugin.md) - Neo4j DBMS plugins.
* [`relate environment`](./docs/environment.md) - Managed sets of related resources and services.
* [`relate extension`](./docs/extension.md) - Install a Relate extension
* [`relate help`](./docs/help.md) - Display help for relate.
* [`relate project`](./docs/project.md) - Projects bring files and data together.

<!-- commandsstop -->
