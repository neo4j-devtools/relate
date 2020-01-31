`daedalus account`
==================

Wrapper that defines how to interact with DBMSs.

* [`daedalus account`](#daedalus-account)
* [`daedalus account:add NAME PATH`](#daedalus-accountadd-name-path)
* [`daedalus account:current`](#daedalus-accountcurrent)
* [`daedalus account:edit-config IDENTIFIER`](#daedalus-accountedit-config-identifier)
* [`daedalus account:list`](#daedalus-accountlist)
* [`daedalus account:remove [IDENTIFIERS...]`](#daedalus-accountremove-identifiers)
* [`daedalus account:use IDENTIFIER`](#daedalus-accountuse-identifier)

## `daedalus account`

Wrapper that defines how to interact with DBMSs.

```
USAGE
  $ daedalus account
```

_See code: [dist/commands/account/index.ts](dist/commands/account/index.ts)_

## `daedalus account:add NAME PATH`

Add an account called NAME for the configuration at PATH.

```
USAGE
  $ daedalus account:add NAME PATH

ARGUMENTS
  NAME
  PATH  Path or URL to the configuration file for the account.

OPTIONS
  -h, --help  show CLI help

EXAMPLES
  $ deadalus account:add LocalAccount ./path/to/account.conf
  $ deadalus account:add SSHAccount https://myhosted.account.conf
```

_See code: [dist/commands/account/add.ts](dist/commands/account/add.ts)_

## `daedalus account:current`

Return information about the selected account.

```
USAGE
  $ daedalus account:current

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
```

_See code: [dist/commands/account/current.ts](dist/commands/account/current.ts)_

## `daedalus account:edit-config IDENTIFIER`

Open the configuration of the specified account in the default editor.

```
USAGE
  $ daedalus account:edit-config IDENTIFIER

ARGUMENTS
  IDENTIFIER  Can be a name or ID.
```

_See code: [dist/commands/account/edit-config.ts](dist/commands/account/edit-config.ts)_

## `daedalus account:list`

List saved accounts.

```
USAGE
  $ daedalus account:list

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
  --ids                Return only IDs. Useful for scripting.

ALIASES
  $ daedalus ls
```

_See code: [dist/commands/account/list.ts](dist/commands/account/list.ts)_

## `daedalus account:remove [IDENTIFIERS...]`

Remove one or more accounts.

```
USAGE
  $ daedalus account:remove [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN

ALIASES
  $ daedalus rm

EXAMPLES
  daedalus account:remove 4e3efc84
  daedalus account:list --ids | daedalus account:remove # remove all account
  daedalus account:list | fzf | awk '{print $2}' | daedalus account:remove # fuzzy search by name and delete
```

_See code: [dist/commands/account/remove.ts](dist/commands/account/remove.ts)_

## `daedalus account:use IDENTIFIER`

Set the account in use for the current session.

```
USAGE
  $ daedalus account:use IDENTIFIER

ARGUMENTS
  IDENTIFIER  Can be a name or ID.
```

_See code: [dist/commands/account/use.ts](dist/commands/account/use.ts)_
