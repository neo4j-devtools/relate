`relate plugins`
================

list installed plugins

* [`relate plugins`](#relate-plugins)
* [`relate plugins:install PLUGIN...`](#relate-pluginsinstall-plugin)
* [`relate plugins:link PLUGIN`](#relate-pluginslink-plugin)
* [`relate plugins:uninstall PLUGIN...`](#relate-pluginsuninstall-plugin)
* [`relate plugins:update`](#relate-pluginsupdate)

## `relate plugins`

list installed plugins

```
USAGE
  $ relate plugins

OPTIONS
  --core  show core plugins

EXAMPLE
  $ relate plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/index.ts)_

## `relate plugins:install PLUGIN...`

installs a plugin into the CLI

```
USAGE
  $ relate plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  plugin to install

OPTIONS
  -f, --force    yarn install with force flag
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command 
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in 
  the CLI without the need to patch and update the whole CLI.

ALIASES
  $ relate plugins:add

EXAMPLES
  $ relate plugins:install myplugin 
  $ relate plugins:install https://github.com/someuser/someplugin
  $ relate plugins:install someuser/someplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/install.ts)_

## `relate plugins:link PLUGIN`

links a plugin into the CLI for development

```
USAGE
  $ relate plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

DESCRIPTION
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello' 
  command will override the user-installed or core plugin implementation. This is useful for development work.

EXAMPLE
  $ relate plugins:link myplugin
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/link.ts)_

## `relate plugins:uninstall PLUGIN...`

removes a plugin from the CLI

```
USAGE
  $ relate plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

OPTIONS
  -h, --help     show CLI help
  -v, --verbose

ALIASES
  $ relate plugins:unlink
  $ relate plugins:remove
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/uninstall.ts)_

## `relate plugins:update`

update installed plugins

```
USAGE
  $ relate plugins:update

OPTIONS
  -h, --help     show CLI help
  -v, --verbose
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v1.9.5/src/commands/plugins/update.ts)_
