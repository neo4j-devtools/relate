`relate dbms`
=============

Neo4j DBMS installations.

* [`relate dbms access-token DBMS`](#relate-dbms-access-token-dbms)
* [`relate dbms add-tag DBMS TAGNAME`](#relate-dbms-add-tag-dbms-tagname)
* [`relate dbms info [DBMSS]`](#relate-dbms-info-dbmss)
* [`relate dbms install VERSION`](#relate-dbms-install-version)
* [`relate dbms link FILEPATH DBMSNAME`](#relate-dbms-link-filepath-dbmsname)
* [`relate dbms list`](#relate-dbms-list)
* [`relate dbms remove-tag DBMS TAGNAME`](#relate-dbms-remove-tag-dbms-tagname)
* [`relate dbms start [DBMSS]`](#relate-dbms-start-dbmss)
* [`relate dbms stop [DBMSS]`](#relate-dbms-stop-dbmss)
* [`relate dbms uninstall DBMS`](#relate-dbms-uninstall-dbms)
* [`relate dbms upgrade DBMS`](#relate-dbms-upgrade-dbms)

## `relate dbms access-token DBMS`

Generate access token for a Neo4j >=4.x enterprise DBMS

```
USAGE
  $ relate dbms access-token DBMS [-e <value>] [-u <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -u, --user=<value>         [default: neo4j] Neo4j DBMS user to create the token for

DESCRIPTION
  Generate access token for a Neo4j >=4.x enterprise DBMS

EXAMPLES
  $ relate dbms:access-token

  $ relate dbms:access-token -e environment-name

  $ relate dbms:access-token my-dbms

  $ relate dbms:access-token my-dbms -u dbms-user
```

## `relate dbms add-tag DBMS TAGNAME`

Tag a DBMS

```
USAGE
  $ relate dbms add-tag DBMS TAGNAME [-e <value>]

ARGUMENTS
  DBMS     Name or ID of a Neo4j instance
  TAGNAME

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Tag a DBMS

EXAMPLES
  $ relate dbms:add-tag dbmsId "production"
```

## `relate dbms info [DBMSS]`

Show the status of one or more Neo4j DBMSs

```
USAGE
  $ relate dbms info [DBMSS] [-e <value>] [--onlineCheck] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml | --no-truncate | ] [--no-header | ]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --onlineCheck              Check if the DBMS is online
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  Show the status of one or more Neo4j DBMSs

EXAMPLES
  $ relate dbms:info

  $ relate dbms:info -e environment-name

  $ relate dbms:info -x

  $ relate dbms:info --columns=id,name --no-header --no-truncate

  $ relate dbms:info --sort=name

  $ relate dbms:info --filter=name=my-dbms --output=json
```

## `relate dbms install VERSION`

Install a new Neo4j DBMS

```
USAGE
  $ relate dbms install VERSION -n <value> [-e <value>] [--noCaching] [--limited]

ARGUMENTS
  VERSION  Version to install (semver, url, or path)

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -n, --name=<value>         (required) Name to give the newly installed DBMS
  --limited                  Display limited versions of DBMSs
  --noCaching                Prevent caching of the downloaded DBMS

DESCRIPTION
  Install a new Neo4j DBMS

EXAMPLES
  $ relate dbms:install

  $ relate dbms:install --limited

  $ relate dbms:install -n my-new-dbms

  $ relate dbms:install 4.0.2 -n my-new-dbms

  $ relate dbms:install 4.0.2 -n my-new-dbms -e environment-name --no-caching
```

## `relate dbms link FILEPATH DBMSNAME`

Link to an existing DBMS installation

```
USAGE
  $ relate dbms link FILEPATH DBMSNAME -y

FLAGS
  -y, --confirm  (required) Confirm DBMS configuration changes

DESCRIPTION
  Link to an existing DBMS installation
  Linking a DBMS enables relate to manage it.

EXAMPLES
  $ relate dbms:link /path/to/target/dbms/dir "related DBMS"
```

## `relate dbms list`

List installed Neo4j DBMSs

```
USAGE
  $ relate dbms list [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml | --no-truncate | ] [--no-header | ]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  List installed Neo4j DBMSs

EXAMPLES
  $ relate dbms:list

  $ relate dbms:list -e environment-name

  $ relate dbms:list --columns=id,name --no-header --no-truncate

  $ relate dbms:list --sort=name

  $ relate dbms:list --filter=name=my-dbms --output=json
```

## `relate dbms remove-tag DBMS TAGNAME`

Remove tag from a DBMS

```
USAGE
  $ relate dbms remove-tag DBMS TAGNAME [-e <value>]

ARGUMENTS
  DBMS     Name or ID of a Neo4j instance
  TAGNAME

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Remove tag from a DBMS

EXAMPLES
  $ relate dbms:remove-tag dbmsId "waiting for approval"
```

## `relate dbms start [DBMSS]`

Start one or more Neo4j DBMSs

```
USAGE
  $ relate dbms start [DBMSS] [-e <value>]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Start one or more Neo4j DBMSs

EXAMPLES
  $ relate dbms:start

  $ relate dbms:start my-dbms

  $ relate dbms:start my-dbms my-other-dbms

  $ relate dbms:start -e environment-name
```

## `relate dbms stop [DBMSS]`

Stop one or more Neo4j DBMSs

```
USAGE
  $ relate dbms stop [DBMSS] [-e <value>] [--shutdown]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  --shutdown                 Use the shutdown procedure, if available, to stop the DBMS (needed on Windows for a
                             graceful stop)

DESCRIPTION
  Stop one or more Neo4j DBMSs

EXAMPLES
  $ relate dbms:stop

  $ relate dbms:stop my-dbms

  $ relate dbms:stop my-dbms my-other-dbms

  $ relate dbms:stop -e environment-name
```

## `relate dbms uninstall DBMS`

Uninstall a Neo4j DBMS

```
USAGE
  $ relate dbms uninstall DBMS [-e <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Uninstall a Neo4j DBMS

EXAMPLES
  $ relate dbms:uninstall

  $ relate dbms:uninstall -e environment-name

  $ relate dbms:uninstall my-dbms

  $ relate dbms:uninstall my-dbms -u dbms-user
```

## `relate dbms upgrade DBMS`

Upgrade an installed DBMS to a newer version

```
USAGE
  $ relate dbms upgrade DBMS -v <value> [-e <value>] [--noCaching] [--noMigration]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -v, --version=<value>      (required) Version to install (semver, url, or path)
  --noCaching                Prevent caching of the downloaded DBMS
  --noMigration              Prevent migrating the data to new formats

DESCRIPTION
  Upgrade an installed DBMS to a newer version

EXAMPLES
  $ relate dbms:upgrade

  $ relate dbms:upgrade -e environment-name

  $ relate dbms:upgrade <dbms-id> -v 4.4.11
```
