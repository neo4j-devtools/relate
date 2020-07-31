`relate backup`
===============

Create a new backup

* [`relate backup:create ENTITYNAMEORID`](#relate-backupcreate-entitynameorid)

## `relate backup:create ENTITYNAMEORID`

Create a new backup

```
USAGE
  $ relate backup:create ENTITYNAMEORID

ARGUMENTS
  ENTITYNAMEORID  Entity id

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -t, --type=(dbms|project)      (required) The relate entity type

EXAMPLES
  $ relate backup:create
  $ relate backup:create -e environment-name
  $ relate backup:create <entity-id> -t dbms
```

_See code: [dist/commands/backup/create.ts](https://github.com/neo-technology/relate/blob/v1.0.2-alpha.3/dist/commands/backup/create.ts)_
