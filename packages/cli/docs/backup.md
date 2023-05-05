`relate backup`
===============

Archives of Relate-managed resources (though not Neo4j databases; see "db:dump").

* [`relate backup create ENTITYNAMEORID`](#relate-backup-create-entitynameorid)
* [`relate backup list`](#relate-backup-list)
* [`relate backup remove BACKUPID`](#relate-backup-remove-backupid)
* [`relate backup restore BACKUPIDORPATH [OUTPUTPATH]`](#relate-backup-restore-backupidorpath-outputpath)

## `relate backup create ENTITYNAMEORID`

Create a new resource backup

```
USAGE
  $ relate backup create ENTITYNAMEORID -t dbms|project [-e <value>]

ARGUMENTS
  ENTITYNAMEORID  Entity id

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -t, --type=<option>        (required) The relate entity type
                             <options: dbms|project>

DESCRIPTION
  Create a new resource backup

EXAMPLES
  $ relate backup:create

  $ relate backup:create -e environment-name

  $ relate backup:create <entity-id> -t dbms
```

## `relate backup list`

List resource backups

```
USAGE
  $ relate backup list [-e <value>] [--columns <value> | ] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml | --no-truncate | ] [--no-header | ] [-t dbms|project]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -t, --type=<option>        The relate entity type
                             <options: dbms|project>
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  List resource backups

EXAMPLES
  $ relate backup:list

  $ relate backup:list -e environment-name

  $ relate backup:list --columns=entityType,entityId --no-header --no-truncate

  $ relate backup:list --sort=created
```

## `relate backup remove BACKUPID`

Remove a resource backup

```
USAGE
  $ relate backup remove BACKUPID [-e <value>]

ARGUMENTS
  BACKUPID  Backup ID

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Remove a resource backup

EXAMPLES
  $ relate backup:remove <backup-id-or-path>

  $ relate backup:remove -e environment-name
```

## `relate backup restore BACKUPIDORPATH [OUTPUTPATH]`

Restore resource from a backup

```
USAGE
  $ relate backup restore BACKUPIDORPATH [OUTPUTPATH] [-e <value>]

ARGUMENTS
  BACKUPIDORPATH  Backup ID or path
  OUTPUTPATH      destination of backup

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Restore resource from a backup

EXAMPLES
  $ relate backup:restore <backup-id-or-path>

  $ relate backup:restore -e environment-name

  $ relate backup:restore <backup-id-or-path> <output-path>
```
