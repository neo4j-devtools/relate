`relate environment`
====================

Managed sets of related resources and services, which may be local or remote.

* [`relate environment:api-token [CLIENTID]`](#relate-environmentapi-token-clientid)
* [`relate environment:init`](#relate-environmentinit)
* [`relate environment:list`](#relate-environmentlist)
* [`relate environment:login [ENVIRONMENT]`](#relate-environmentlogin-environment)
* [`relate environment:open [ENVIRONMENT]`](#relate-environmentopen-environment)
* [`relate environment:use ENVIRONMENT`](#relate-environmentuse-environment)

## `relate environment:api-token [CLIENTID]`

Generate API token for HTTP access to Relate

```
USAGE
  $ relate environment:api-token [CLIENTID]

ARGUMENTS
  CLIENTID  Client ID

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -h, --hostName=hostName        Client host name (if other than current environment)

ALIASES
  $ relate env:api-token

EXAMPLES
  $ relate env:api-token
  $ relate env:api-token -e environment-name
  $ relate env:api-token my-app
  $ relate env:api-token my-app -h localhost:3000
```

_See code: [dist/commands/environment/api-token.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/api-token.ts)_

## `relate environment:init`

Initialize a new relate environment

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

_See code: [dist/commands/environment/init.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/init.ts)_

## `relate environment:list`

List all available environments

```
USAGE
  $ relate environment:list

ALIASES
  $ relate env:list

EXAMPLE
  $ relate env:list
```

_See code: [dist/commands/environment/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/list.ts)_

## `relate environment:login [ENVIRONMENT]`

Log in to an environment

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

_See code: [dist/commands/environment/login.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/login.ts)_

## `relate environment:open [ENVIRONMENT]`

Open an environment's configuration with your default editor

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

_See code: [dist/commands/environment/open.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/open.ts)_

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

_See code: [dist/commands/environment/use.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/environment/use.ts)_
