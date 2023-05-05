`relate dbms-plugin`
====================

Neo4j DBMS plugins.

* [`relate dbms-plugin add-sources [SOURCES]`](#relate-dbms-plugin-add-sources-sources)
* [`relate dbms-plugin install [DBMSS]`](#relate-dbms-plugin-install-dbmss)
* [`relate dbms-plugin list DBMS`](#relate-dbms-plugin-list-dbms)
* [`relate dbms-plugin list-sources`](#relate-dbms-plugin-list-sources)
* [`relate dbms-plugin remove-sources [SOURCES]`](#relate-dbms-plugin-remove-sources-sources)
* [`relate dbms-plugin uninstall [DBMSS]`](#relate-dbms-plugin-uninstall-dbmss)

## `relate dbms-plugin add-sources [SOURCES]`

Add one or more plugin sources

```
USAGE
  $ relate dbms-plugin add-sources [SOURCES] [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml | --no-truncate | ] [--no-header | ]

ARGUMENTS
  SOURCES  File path or URL to plugin sources

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
  Add one or more plugin sources

ALIASES
  $ relate plugin add-sources

EXAMPLES
  $ relate dbms-plugin:add-sources

  $ relate dbms-plugin:add-sources -e environment-name

  $ relate dbms-plugin:add-sources http://github.com/some/plugin/.neo4j-plugin-source

  $ relate dbms-plugin:add-sources ./local/.neo4j-plugin-source
```

## `relate dbms-plugin install [DBMSS]`

Install plugin on one or more Neo4j DBMSs

```
USAGE
  $ relate dbms-plugin install [DBMSS] -p <value> [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter
    <value>] [--output csv|json|yaml | --no-truncate | ] [--no-header | ]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --plugin=<value>       (required) Name of the plugin to install
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  Install plugin on one or more Neo4j DBMSs

ALIASES
  $ relate plugin install

EXAMPLES
  $ relate dbms-plugin:install

  $ relate dbms-plugin:install dbms1 --plugin apoc

  $ relate dbms-plugin:install dbms1 dbms2 dbms3 --plugin apoc

  $ relate dbms-plugin:install -e environment-name
```

## `relate dbms-plugin list DBMS`

List plugins installed in a Neo4j DBMS

```
USAGE
  $ relate dbms-plugin list DBMS [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
    csv|json|yaml | --no-truncate | ] [--no-header | ]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

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
  List plugins installed in a Neo4j DBMS

ALIASES
  $ relate plugin list

EXAMPLES
  $ relate dbms-plugin:list MyDbms

  $ relate dbms-plugin:list MyDbms -e environment-name

  $ relate dbms-plugin:list MyDbms --columns=id,name --no-header --no-truncate

  $ relate dbms-plugin:list MyDbms --sort=name

  $ relate dbms-plugin:list MyDbms --filter=name=my-dbms --output=json
```

## `relate dbms-plugin list-sources`

List available plugin sources

```
USAGE
  $ relate dbms-plugin list-sources [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List available plugin sources

ALIASES
  $ relate plugin list-sources

EXAMPLES
  $ relate dbms-plugin:list-sources

  $ relate dbms-plugin:list-sources -e environment-name

  $ relate dbms-plugin:list-sources --columns=id,name --no-header --no-truncate

  $ relate dbms-plugin:list-sources --sort=name

  $ relate dbms-plugin:list-sources --filter=name=my-dbms --output=json
```

## `relate dbms-plugin remove-sources [SOURCES]`

Remove one or more plugin sources

```
USAGE
  $ relate dbms-plugin remove-sources [SOURCES] [-e <value>]

ARGUMENTS
  SOURCES  Names of the plugin sources to remove

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against

DESCRIPTION
  Remove one or more plugin sources

ALIASES
  $ relate plugin remove-sources

EXAMPLES
  $ relate dbms-plugin:remove-sources

  $ relate dbms-plugin:remove-sources -e environment-name

  $ relate dbms-plugin:remove-sources sourceName

  $ relate dbms-plugin:remove-sources sourceName1 sourceName2
```

## `relate dbms-plugin uninstall [DBMSS]`

Uninstall plugin from one or more Neo4j DBMSs

```
USAGE
  $ relate dbms-plugin uninstall [DBMSS] -p <value> [-e <value>]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --plugin=<value>       (required) Name of the plugin to uninstall

DESCRIPTION
  Uninstall plugin from one or more Neo4j DBMSs

ALIASES
  $ relate plugin uninstall

EXAMPLES
  $ relate dbms-plugin:uninstall

  $ relate dbms-plugin:uninstall dbms1 --plugin apoc

  $ relate dbms-plugin:uninstall dbms1 dbms2 dbms3 --plugin apoc

  $ relate dbms-plugin:uninstall -e environment-name
```
