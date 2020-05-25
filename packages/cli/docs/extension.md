`relate extension`
==================

Manage Relate extensions

* [`relate extension:install NAME VERSION`](#relate-extensioninstall-name-version)
* [`relate extension:link [FILEPATH]`](#relate-extensionlink-filepath)
* [`relate extension:uninstall [EXTENSION]`](#relate-extensionuninstall-extension)

## `relate extension:install NAME VERSION`

Install an extension

```
USAGE
  $ relate extension:install NAME VERSION

ARGUMENTS
  NAME
  VERSION  Version to install
```

_See code: [dist/commands/extension/install.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/extension/install.ts)_

## `relate extension:link [FILEPATH]`

Link an extension (useful for development)

```
USAGE
  $ relate extension:link [FILEPATH]
```

_See code: [dist/commands/extension/link.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/extension/link.ts)_

## `relate extension:uninstall [EXTENSION]`

Uninstall an extension

```
USAGE
  $ relate extension:uninstall [EXTENSION]

ARGUMENTS
  EXTENSION  Name of the extension to uninstall
```

_See code: [dist/commands/extension/uninstall.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/extension/uninstall.ts)_
