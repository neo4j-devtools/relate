`relate environment`
====================

Manage relate environments

* [`relate environment:init`](#relate-environmentinit)
* [`relate environment:list`](#relate-environmentlist)
* [`relate environment:login [ENVIRONMENT]`](#relate-environmentlogin-environment)
* [`relate environment:open [ENVIRONMENT]`](#relate-environmentopen-environment)
* [`relate environment:use ENVIRONMENT`](#relate-environmentuse-environment)

## `relate environment:init`

Create a new environment

```
USAGE
  $ relate environment:init

OPTIONS
  --httpOrigin=httpOrigin  URL of the hosted instance of relate (only applies to --type=REMOTE)
  --name=name              (required) Name of the environment to initialize
  --type=(LOCAL|REMOTE)    (required) Type of environment

ALIASES
  $ relate env:init

EXAMPLES
  $ relate env:init
  $ relate env:init --name=local-environment-name --type=LOCAL
  $ relate env:init --name=remote-environment-name --type=REMOTE --httpOrigin=https://url.of.hosted.relate.com
```

_See code: [dist/commands/environment/init.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.8/dist/commands/environment/init.ts)_

## `relate environment:list`

Lists all available environments

```
USAGE
  $ relate environment:list

ALIASES
  $ relate env:list

EXAMPLE
  $ relate env:list
```

_See code: [dist/commands/environment/list.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.8/dist/commands/environment/list.ts)_

## `relate environment:login [ENVIRONMENT]`

Login into an environment

```
USAGE
  $ relate environment:login [ENVIRONMENT]

ARGUMENTS
  ENVIRONMENT  Name of the environment to run the command against

ALIASES
  $ relate env:login

EXAMPLES
  $ relate env:login
  $ relate env:login environment-supporting-login
```

_See code: [dist/commands/environment/login.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.8/dist/commands/environment/login.ts)_

## `relate environment:open [ENVIRONMENT]`

Open an environment's configuration with the default editor

```
USAGE
  $ relate environment:open [ENVIRONMENT]

ARGUMENTS
  ENVIRONMENT  Name of the environment to run the command against

OPTIONS
  -L, --log  If set, log the path instead

ALIASES
  $ relate env:open

EXAMPLES
  $ relate env:open
  $ relate env:open environment-name
  $ relate env:open environment-name -L
```

_See code: [dist/commands/environment/open.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.8/dist/commands/environment/open.ts)_

## `relate environment:use ENVIRONMENT`

Set an environment as default

```
USAGE
  $ relate environment:use ENVIRONMENT

ARGUMENTS
  ENVIRONMENT  Name of the environment to set as active

ALIASES
  $ relate env:use

EXAMPLE
  $ relate env:use environment-to-set-as-active
```

_See code: [dist/commands/environment/use.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.8/dist/commands/environment/use.ts)_
