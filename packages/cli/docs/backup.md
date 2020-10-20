`relate backup`
===============

Archives of Relate-managed resources (though not Neo4j databases; see "db:dump").

* [`relate backup:create ENTITYNAMEORID`](#relate-backupcreate-entitynameorid)
* [`relate backup:list`](#relate-backuplist)
* [`relate backup:remove BACKUPID`](#relate-backupremove-backupid)
* [`relate backup:restore BACKUPIDORPATH [OUTPUTPATH]`](#relate-backuprestore-backupidorpath-outputpath)

## `relate backup:create ENTITYNAMEORID`

Create a new resource backup

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

_See code: [dist/commands/backup/create.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/backup/create.ts)_

## `relate backup:list`

List resource backups

```
USAGE
  $ relate backup:list

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -t, --type=(dbms|project)      The relate entity type
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)

EXAMPLES
  $ relate backup:list
  $ relate backup:list -e environment-name
  $ relate backup:list --columns=entityType,entityId --no-header --no-truncate
  $ relate backup:list --sort=created
```

_See code: [dist/commands/backup/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/backup/list.ts)_

## `relate backup:remove BACKUPID`

Remove a resource backup

```
USAGE
  $ relate backup:remove BACKUPID

ARGUMENTS
  BACKUPID  Backup ID

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate backup:remove <backup-id-or-path>
  $ relate backup:remove -e environment-name
```

_See code: [dist/commands/backup/remove.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/backup/remove.ts)_

## `relate backup:restore BACKUPIDORPATH [OUTPUTPATH]`

Restore resource from a backup

```
USAGE
  $ relate backup:restore BACKUPIDORPATH [OUTPUTPATH]

ARGUMENTS
  BACKUPIDORPATH  Backup ID or path
  OUTPUTPATH      destination of backup

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

EXAMPLES
  $ relate backup:restore <backup-id-or-path>
  $ relate backup:restore -e environment-name
  $ relate backup:restore <backup-id-or-path> <output-path>
```

_See code: [dist/commands/backup/restore.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/backup/restore.ts)_
