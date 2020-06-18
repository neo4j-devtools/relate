`relate environment`
====================

Manage relate environments

* [`relate environment:init`](#relate-environmentinit)
* [`relate environment:list`](#relate-environmentlist)
* [`relate environment:login`](#relate-environmentlogin)
* [`relate environment:open`](#relate-environmentopen)
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
```

_See code: [dist/commands/environment/init.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.1/dist/commands/environment/init.ts)_

## `relate environment:list`

Lists all available environments

```
USAGE
  $ relate environment:list

ALIASES
  $ relate env:list
```

_See code: [dist/commands/environment/list.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.1/dist/commands/environment/list.ts)_

## `relate environment:login`

Login into an environment

```
USAGE
  $ relate environment:login

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate env:login
```

_See code: [dist/commands/environment/login.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.1/dist/commands/environment/login.ts)_

## `relate environment:open`

Open an environment's configuration with the default editor

```
USAGE
  $ relate environment:open

OPTIONS
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate env:open
```

_See code: [dist/commands/environment/open.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.1/dist/commands/environment/open.ts)_

## `relate environment:use ENVIRONMENT`

Set an environment as default

```
USAGE
  $ relate environment:use ENVIRONMENT

ARGUMENTS
  ENVIRONMENT  Name of the environment to set as active

ALIASES
  $ relate env:use
```

_See code: [dist/commands/environment/use.ts](https://github.com/neo-technology/relate/blob/v1.0.1-alpha.1/dist/commands/environment/use.ts)_
