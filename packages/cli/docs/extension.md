`relate extension`
==================

Manage relate extensions

* [`relate extension:install [NAME]`](#relate-extensioninstall-name)
* [`relate extension:link [FILEPATH]`](#relate-extensionlink-filepath)
* [`relate extension:list`](#relate-extensionlist)
* [`relate extension:uninstall EXTENSION`](#relate-extensionuninstall-extension)

## `relate extension:install [NAME]`

Install an extension

```
USAGE
  $ relate extension:install [NAME]

OPTIONS
  -V, --version=version          Version to install
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:install
```

_See code: [dist/commands/extension/install.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/extension/install.ts)_

## `relate extension:link [FILEPATH]`

Link an extension (useful for development)

```
USAGE
  $ relate extension:link [FILEPATH]

ALIASES
  $ relate ext:link
```

_See code: [dist/commands/extension/link.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/extension/link.ts)_

## `relate extension:list`

Lists installed extensions

```
USAGE
  $ relate extension:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:list
```

_See code: [dist/commands/extension/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/extension/list.ts)_

## `relate extension:uninstall EXTENSION`

Uninstall an extension

```
USAGE
  $ relate extension:uninstall EXTENSION

ARGUMENTS
  EXTENSION  Name of the extension to uninstall

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate ext:uninstall
```

_See code: [dist/commands/extension/uninstall.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.0/dist/commands/extension/uninstall.ts)_
