`relate extension`
==================

Extensions to the Relate framework.

* [`relate extension install [NAME]`](#relate-extension-install-name)
* [`relate extension link [FILEPATH]`](#relate-extension-link-filepath)
* [`relate extension list`](#relate-extension-list)
* [`relate extension uninstall [EXTENSION]`](#relate-extension-uninstall-extension)

## `relate extension install [NAME]`

Install a Relate extension

```
USAGE
  $ relate extension install [NAME] [-e <value>] [-V <value>]

FLAGS
  -V, --version=<value>      Version to install (semver), or path to tarball
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Install a Relate extension

ALIASES
  $ relate ext install

EXAMPLES
  $ relate ext:install

  $ relate ext:install -e environment-name

  $ relate ext:install extension-name

  $ relate ext:install extension-name -V 1.0.0
```

## `relate extension link [FILEPATH]`

Link a Relate extension.

```
USAGE
  $ relate extension link [FILEPATH]

DESCRIPTION
  Link a Relate extension.

  Useful for development.

ALIASES
  $ relate ext link

EXAMPLES
  $ relate ext:link file/path/to/extension
```

## `relate extension list`

List installed Relate extensions

```
USAGE
  $ relate extension list [-e <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  List installed Relate extensions

ALIASES
  $ relate ext list

EXAMPLES
  $ relate ext:list

  $ relate ext:list -e environment-name
```

## `relate extension uninstall [EXTENSION]`

Uninstall a Relate extension

```
USAGE
  $ relate extension uninstall [EXTENSION] [-e <value>]

ARGUMENTS
  EXTENSION  Name of the extension to uninstall

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Uninstall a Relate extension

ALIASES
  $ relate ext uninstall

EXAMPLES
  $ relate ext:uninstall

  $ relate ext:uninstall -e environment-name

  $ relate ext:uninstall extension-name
```
