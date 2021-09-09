`relate dbms-plugin`
====================

Neo4j DBMS plugins.

* [`relate dbms-plugin:add-sources [SOURCES]`](#relate-dbms-pluginadd-sources-sources)
* [`relate dbms-plugin:install [DBMSS]`](#relate-dbms-plugininstall-dbmss)
* [`relate dbms-plugin:list DBMS`](#relate-dbms-pluginlist-dbms)
* [`relate dbms-plugin:list-sources`](#relate-dbms-pluginlist-sources)
* [`relate dbms-plugin:remove-sources [SOURCES]`](#relate-dbms-pluginremove-sources-sources)
* [`relate dbms-plugin:uninstall [DBMSS]`](#relate-dbms-pluginuninstall-dbmss)

## `relate dbms-plugin:add-sources [SOURCES]`

Add one or more plugin sources

```
USAGE
  $ relate dbms-plugin:add-sources [SOURCES]

ARGUMENTS
  SOURCES  File path or URL to plugin sources

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)

ALIASES
  $ relate plugin:add-sources

EXAMPLES
  $ relate dbms-plugin:add-sources
  $ relate dbms-plugin:add-sources -e environment-name
  $ relate dbms-plugin:add-sources http://github.com/some/plugin/.neo4j-plugin-source
  $ relate dbms-plugin:add-sources ./local/.neo4j-plugin-source
```

_See code: [dist/commands/dbms-plugin/add-sources.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/add-sources.ts)_

## `relate dbms-plugin:install [DBMSS]`

Install plugin on one or more Neo4j DBMSs

```
USAGE
  $ relate dbms-plugin:install [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --plugin=plugin            (required) Name of the plugin to install
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)

ALIASES
  $ relate plugin:install

EXAMPLES
  $ relate dbms-plugin:install
  $ relate dbms-plugin:install dbms1 --plugin apoc
  $ relate dbms-plugin:install dbms1 dbms2 dbms3 --plugin apoc
  $ relate dbms-plugin:install -e environment-name
```

_See code: [dist/commands/dbms-plugin/install.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/install.ts)_

## `relate dbms-plugin:list DBMS`

List plugins installed in a Neo4j DBMS

```
USAGE
  $ relate dbms-plugin:list DBMS

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)

ALIASES
  $ relate plugin:list

EXAMPLES
  $ relate dbms-plugin:list MyDbms
  $ relate dbms-plugin:list MyDbms -e environment-name
  $ relate dbms-plugin:list MyDbms --columns=id,name --no-header --no-truncate
  $ relate dbms-plugin:list MyDbms --sort=name
  $ relate dbms-plugin:list MyDbms --filter=name=my-dbms --output=json
```

_See code: [dist/commands/dbms-plugin/list.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/list.ts)_

## `relate dbms-plugin:list-sources`

List available plugin sources

```
USAGE
  $ relate dbms-plugin:list-sources

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -x, --extended                 show extra columns
  --columns=columns              only show provided columns (comma-separated)
  --filter=filter                filter property by partial string matching, ex: name=foo
  --no-header                    hide table header from output
  --no-truncate                  do not truncate output to fit screen
  --output=csv|json|yaml         output in a more machine friendly format
  --sort=sort                    property to sort by (prepend '-' for descending)

ALIASES
  $ relate plugin:list-sources

EXAMPLES
  $ relate dbms-plugin:list-sources
  $ relate dbms-plugin:list-sources -e environment-name
  $ relate dbms-plugin:list-sources --columns=id,name --no-header --no-truncate
  $ relate dbms-plugin:list-sources --sort=name
  $ relate dbms-plugin:list-sources --filter=name=my-dbms --output=json
```

_See code: [dist/commands/dbms-plugin/list-sources.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/list-sources.ts)_

## `relate dbms-plugin:remove-sources [SOURCES]`

Remove one or more plugin sources

```
USAGE
  $ relate dbms-plugin:remove-sources [SOURCES]

ARGUMENTS
  SOURCES  Names of the plugin sources to remove

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against

ALIASES
  $ relate plugin:remove-sources

EXAMPLES
  $ relate dbms-plugin:remove-sources
  $ relate dbms-plugin:remove-sources -e environment-name
  $ relate dbms-plugin:remove-sources sourceName
  $ relate dbms-plugin:remove-sources sourceName1 sourceName2
```

_See code: [dist/commands/dbms-plugin/remove-sources.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/remove-sources.ts)_

## `relate dbms-plugin:uninstall [DBMSS]`

Uninstall plugin from one or more Neo4j DBMSs

```
USAGE
  $ relate dbms-plugin:uninstall [DBMSS]

ARGUMENTS
  DBMSS  Names or IDs of Neo4j instances

OPTIONS
  -e, --environment=environment  Name of the environment to run the command against
  -p, --plugin=plugin            (required) Name of the plugin to uninstall

ALIASES
  $ relate plugin:uninstall

EXAMPLES
  $ relate dbms-plugin:uninstall
  $ relate dbms-plugin:uninstall dbms1 --plugin apoc
  $ relate dbms-plugin:uninstall dbms1 dbms2 dbms3 --plugin apoc
  $ relate dbms-plugin:uninstall -e environment-name
```

_See code: [dist/commands/dbms-plugin/uninstall.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.4-alpha.0/packages/cli/src/commands/dbms-plugin/uninstall.ts)_
