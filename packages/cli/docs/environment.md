`relate environment`
====================

Managed sets of related resources and services.

* [`relate environment api-token [CLIENTID]`](#relate-environment-api-token-clientid)
* [`relate environment init [ENVIRONMENT]`](#relate-environment-init-environment)
* [`relate environment list`](#relate-environment-list)
* [`relate environment open [ENVIRONMENT]`](#relate-environment-open-environment)
* [`relate environment use ENVIRONMENT`](#relate-environment-use-environment)

## `relate environment api-token [CLIENTID]`

Generate API token for HTTP access to Relate

```
USAGE
  $ relate environment api-token [CLIENTID] [-e <value>] [-h <value>]

ARGUMENTS
  CLIENTID  Client ID

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -h, --hostName=<value>     Client host name (if other than current environment)

DESCRIPTION
  Generate API token for HTTP access to Relate

ALIASES
  $ relate env api-token

EXAMPLES
  $ relate env:api-token

  $ relate env:api-token -e environment-name

  $ relate env:api-token my-app

  $ relate env:api-token my-app -h localhost:3000
```

## `relate environment init [ENVIRONMENT]`

Initialize a new relate environment

```
USAGE
  $ relate environment init [ENVIRONMENT] [-i] [--use] [--noRuntime] [--apiToken]

ARGUMENTS
  ENVIRONMENT  Name of the environment to run the command against

FLAGS
  -i, --interactive  Get prompted for each configuration option available
  --apiToken         If this flag is provided and the environment created is set as active, all requests to @relate/web
                     will require API tokens
  --noRuntime        Skip downloading the Java runtime required by the DBMS
  --use              Set environment as active right after creating it

DESCRIPTION
  Initialize a new relate environment

ALIASES
  $ relate env init

EXAMPLES
  $ relate env:init environment-name

  $ relate env:init environment-name --use

  $ relate env:init environment-name --interactive
```

## `relate environment list`

List all available environments

```
USAGE
  $ relate environment list

DESCRIPTION
  List all available environments

ALIASES
  $ relate env list

EXAMPLES
  $ relate env:list
```

## `relate environment open [ENVIRONMENT]`

Open an environment's configuration with your default editor

```
USAGE
  $ relate environment open [ENVIRONMENT] [-L]

ARGUMENTS
  ENVIRONMENT  Name of the environment to run the command against

FLAGS
  -L, --log  If set, log the path instead

DESCRIPTION
  Open an environment's configuration with your default editor

ALIASES
  $ relate env open

EXAMPLES
  $ relate env:open

  $ relate env:open environment-name

  $ relate env:open environment-name -L
```

## `relate environment use ENVIRONMENT`

Set an environment as default

```
USAGE
  $ relate environment use ENVIRONMENT

ARGUMENTS
  ENVIRONMENT  Name of the environment to set as active

DESCRIPTION
  Set an environment as default

ALIASES
  $ relate env use

EXAMPLES
  $ relate env:use environment-to-set-as-active
```
