`relate extension`
==================

Extensions to the Relate framework.

* [`relate extension:install [NAME]`](#relate-extensioninstall-name)
* [`relate extension:link [FILEPATH]`](#relate-extensionlink-filepath)
* [`relate extension:list`](#relate-extensionlist)
* [`relate extension:uninstall [EXTENSION]`](#relate-extensionuninstall-extension)

## `relate extension:install [NAME]`

Install a Relate extension

```
USAGE
  $ relate extension:install [NAME]

OPTIONS
  -V, --version=version          Version to install
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:install

EXAMPLES
  $ relate ext:install
  $ relate ext:install -e environment-name
  $ relate ext:install extension-name
  $ relate ext:install extension-name -V 1.0.0
```

_See code: [dist/commands/extension/install.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/extension/install.ts)_

## `relate extension:link [FILEPATH]`

Link a Relate extension.

```
USAGE
  $ relate extension:link [FILEPATH]

DESCRIPTION
  Useful for development.

ALIASES
  $ relate ext:link

EXAMPLE
  $ relate ext:link file/path/to/extension
```

_See code: [dist/commands/extension/link.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/extension/link.ts)_

## `relate extension:list`

List installed Relate extensions

```
USAGE
  $ relate extension:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:list

EXAMPLES
  $ relate ext:list
  $ relate ext:list -e environment-name
```

_See code: [dist/commands/extension/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/extension/list.ts)_

## `relate extension:uninstall [EXTENSION]`

Uninstall a Relate extension

```
USAGE
  $ relate extension:uninstall [EXTENSION]

ARGUMENTS
  EXTENSION  Name of the extension to uninstall

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:uninstall

EXAMPLES
  $ relate ext:uninstall
  $ relate ext:uninstall -e environment-name
  $ relate ext:uninstall extension-name
```

_See code: [dist/commands/extension/uninstall.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/extension/uninstall.ts)_
