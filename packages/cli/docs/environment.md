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
  --httpOrigin=httpOrigin     URL of the hosted instance of relate (only applies to --type=REMOTE)
  --name=name                 Name of the environment to initialize
  --remoteEnv=remoteEnv       Name of the hosted environment (in case of --type=REMOTE)
  --type=(LOCAL|REMOTE|DEMO)  Type of environment

ALIASES
  $ relate env:init
```

_See code: [dist/commands/environment/init.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/init.ts)_

## `relate environment:login`

```
USAGE
  $ relate environment:login

OPTIONS
  -e, --environment=environment  [default: default] Name of the environment to run the command against

ALIASES
  $ relate env:login
```

_See code: [dist/commands/environment/login.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/login.ts)_

## `relate environment:open`

```
USAGE
  $ relate environment:open

OPTIONS
  -L, --log                      If set, log the path instead
  -e, --environment=environment  [default: default] Name of the environment to run the command against

ALIASES
  $ relate env:open
```

_See code: [dist/commands/environment/open.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist/commands/environment/open.ts)_
