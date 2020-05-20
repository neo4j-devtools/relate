`relate environment`
====================



* [`relate environment:init`](#relate-environmentinit)
* [`relate environment:login`](#relate-environmentlogin)
* [`relate environment:open`](#relate-environmentopen)

## `relate environment:init`

```
USAGE
  $ relate environment:init

OPTIONS
  --name=name            Name of the environment. Will be used in most commands.
  --remoteEnv=remoteEnv  Name of the hosted environment
  --remoteUrl=remoteUrl  URL of the remote instance of relate
  --type=(LOCAL|REMOTE)

ALIASES
  $ relate env:init
```

_See code: [dist/commands/environment/init.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/init.ts)_

## `relate environment:login`

```
USAGE
  $ relate environment:login

OPTIONS
  -E, --environment=environment  Environment to run the command against

ALIASES
  $ relate env:login
```

_See code: [dist/commands/environment/login.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/login.ts)_

## `relate environment:open`

```
USAGE
  $ relate environment:open

OPTIONS
  -E, --environment=environment  Environment to run the command against
  -L, --log                      If set, log the path instead

ALIASES
  $ relate env:open
```

_See code: [dist/commands/environment/open.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/open.ts)_
