`relate project`
================

Projects bring files and data together.

* [`relate project add-dbms DBMS`](#relate-project-add-dbms-dbms)
* [`relate project add-file SOURCE`](#relate-project-add-file-source)
* [`relate project init`](#relate-project-init)
* [`relate project install-sample`](#relate-project-install-sample)
* [`relate project link FILEPATH`](#relate-project-link-filepath)
* [`relate project list`](#relate-project-list)
* [`relate project list-dbmss`](#relate-project-list-dbmss)
* [`relate project list-files`](#relate-project-list-files)
* [`relate project open`](#relate-project-open)
* [`relate project remove-dbms DBMS`](#relate-project-remove-dbms-dbms)
* [`relate project remove-file FILE`](#relate-project-remove-file-file)

## `relate project add-dbms DBMS`

Add a DBMS connection to a project

```
USAGE
  $ relate project add-dbms [DBMS] -p <value> [-e <value>] [-n <value>] [-u <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -n, --name=<value>         Project DBMS name
  -p, --project=<value>      (required) Name of the project to run the command against
  -u, --user=<value>         [default: neo4j] Neo4j DBMS user to create the token for

DESCRIPTION
  Add a DBMS connection to a project

EXAMPLES
  $ relate project:add-dbms

  $ relate project:add-dbms -e environment-name

  $ relate project:add-dbms -p my-project

  $ relate project:add-dbms -p my-project -n dbms-name-in-project -u dbms-user-to-create-token-for
```

## `relate project add-file SOURCE`

Add a file to a project

```
USAGE
  $ relate project add-file [SOURCE] -p <value> [-e <value>] [-d <value>] [--overwrite]

FLAGS
  -d, --destination=<value>  The relative path of the file (including name) in the project
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against
  --overwrite                Overwrite existing destination file

DESCRIPTION
  Add a file to a project

EXAMPLES
  $ relate project:add-file

  $ relate project:add-file -e environment-name

  $ relate project:add-file -p my-project -d relative/path/to/dest.file /path/to/source.file

  $ relate project:add-file -p my-project -d /path/to/existing-dest.file /path/to/source.file --overwrite
```

## `relate project init`

Initialize a new project

```
USAGE
  $ relate project init --name <value> [-e <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  --name=<value>             (required) Name of the project to initialize

DESCRIPTION
  Initialize a new project

EXAMPLES
  $ relate project:init /path/to/target/project/dir

  $ relate project:init /path/to/target/project/dir -e environment-name

  $ relate project:init /path/to/target/project/dir --name=my-project
```

## `relate project install-sample`

Install sample project

```
USAGE
  $ relate project install-sample -p <value> [-e <value>] [-t <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against
  -t, --to=<value>           Path where the project directory will be created.

DESCRIPTION
  Install sample project

EXAMPLES
  $ relate project:install-sample
```

## `relate project link FILEPATH`

Link a project

```
USAGE
  $ relate project link [FILEPATH] -n <value>

FLAGS
  -n, --name=<value>  (required) Name of the project

DESCRIPTION
  Link a project

EXAMPLES
  $ relate project:link /path/to/target/project/dir
```

## `relate project list`

List all projects

```
USAGE
  $ relate project list [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>] [--output
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
  List all projects

EXAMPLES
  $ relate project:list

  $ relate project:list -e environment-name
```

## `relate project list-dbmss`

List project DBMS connections

```
USAGE
  $ relate project list-dbmss -p <value> [-e <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against

DESCRIPTION
  List project DBMS connections

EXAMPLES
  $ relate project:list-dbmss

  $ relate project:list-dbmss -e environment-name

  $ relate project:list-dbmss -p my-project
```

## `relate project list-files`

List project files

```
USAGE
  $ relate project list-files -p <value> [-e <value>] [--columns <value> | -x] [--sort <value>] [--filter <value>]
    [--output csv|json|yaml | --no-truncate | ] [--no-header | ] [-i <value>] [-l <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -i, --ignore=<value>...    [default: node_modules,.git] List of directories to ignore
  -l, --limit=<value>        Max number of files to list
  -p, --project=<value>      (required) Name of the project to run the command against
  -x, --extended             show extra columns
  --columns=<value>          only show provided columns (comma-separated)
  --filter=<value>           filter property by partial string matching, ex: name=foo
  --no-header                hide table header from output
  --no-truncate              do not truncate output to fit screen
  --output=<option>          output in a more machine friendly format
                             <options: csv|json|yaml>
  --sort=<value>             property to sort by (prepend '-' for descending)

DESCRIPTION
  List project files

EXAMPLES
  $ relate project:list-files

  $ relate project:list-files -e environment-name

  $ relate project:list-files -p my-project

  $ relate project:list-files --ignore node_module --ignore dist

  $ relate project:list-files --ignore node_module,dist
```

## `relate project open`

Open a project's folder

```
USAGE
  $ relate project open -p <value> [-e <value>] [-L]

FLAGS
  -L, --log                  If set, log the path instead
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against

DESCRIPTION
  Open a project's folder

EXAMPLES
  $ relate project:open

  $ relate project:open -e environment-name

  $ relate project:open -p my-project

  $ relate project:open -p my-project -L
```

## `relate project remove-dbms DBMS`

Remove a DBMS connection from a project

```
USAGE
  $ relate project remove-dbms [DBMS] -p <value> [-e <value>]

ARGUMENTS
  DBMS  Name or ID of a Neo4j instance

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against

DESCRIPTION
  Remove a DBMS connection from a project

EXAMPLES
  $ relate project:remove-dbms

  $ relate project:remove-dbms -e environment-name

  $ relate project:remove-dbms project-dbms-name

  $ relate project:remove-dbms project-dbms-name -p my-project
```

## `relate project remove-file FILE`

Remove a file from a project

```
USAGE
  $ relate project remove-file [FILE] -p <value> [-e <value>]

FLAGS
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      (required) Name of the project to run the command against

DESCRIPTION
  Remove a file from a project

EXAMPLES
  $ relate project:remove-file

  $ relate project:remove-file -e environment-name

  $ relate project:remove-file /project/path/to/name.file

  $ relate project:remove-file /project/path/to/name.file -p my-project
```
