`relate account`
==================

Wrapper that defines how to interact with DBMSs.

* [`relate account`](#relate-account)
* [`relate account:add NAME PATH`](#relate-accountadd-name-path)
* [`relate account:current`](#relate-accountcurrent)
* [`relate account:edit-config IDENTIFIER`](#relate-accountedit-config-identifier)
* [`relate account:list`](#relate-accountlist)
* [`relate account:remove [IDENTIFIERS...]`](#relate-accountremove-identifiers)
* [`relate account:use IDENTIFIER`](#relate-accountuse-identifier)

## `relate account`

Wrapper that defines how to interact with DBMSs.

```
USAGE
  $ relate account
```

_See code: [dist/commands/account/index.ts](dist/commands/account/index.ts)_

## `relate account:add NAME PATH`

Add an account called NAME for the configuration at PATH.

```
USAGE
  $ relate account:add NAME PATH

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

## `relate account:current`

Return information about the selected account.

```
USAGE
  $ relate account:current

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
```

_See code: [dist/commands/account/current.ts](dist/commands/account/current.ts)_

## `relate account:edit-config IDENTIFIER`

Open the configuration of the specified account in the default editor.

```
USAGE
  $ relate account:edit-config IDENTIFIER

ARGUMENTS
  IDENTIFIER  Can be a name or ID.
```

_See code: [dist/commands/account/edit-config.ts](dist/commands/account/edit-config.ts)_

## `relate account:list`

List saved accounts.

```
USAGE
  $ relate account:list

OPTIONS
  -f, --format=format  Specify in which format to log the information.
  -j, --json           Log the information in JSON output.
  --ids                Return only IDs. Useful for scripting.

ALIASES
  $ relate ls
```

_See code: [dist/commands/account/list.ts](dist/commands/account/list.ts)_

## `relate account:remove [IDENTIFIERS...]`

Remove one or more accounts.

```
USAGE
  $ relate account:remove [IDENTIFIERS...]

ARGUMENTS
  IDENTIFIERS...  Identifiers can be names or IDs. If omitted they will be retrieved via STDIN

ALIASES
  $ relate rm

EXAMPLES
  relate account:remove 4e3efc84
  relate account:list --ids | relate account:remove # remove all account
  relate account:list | fzf | awk '{print $2}' | relate account:remove # fuzzy search by name and delete
```

_See code: [dist/commands/account/remove.ts](dist/commands/account/remove.ts)_

## `relate account:use IDENTIFIER`

Set the account in use for the current session.

```
USAGE
  $ relate account:use IDENTIFIER

ARGUMENTS
  IDENTIFIER  Can be a name or ID.
```

_See code: [dist/commands/account/use.ts](dist/commands/account/use.ts)_
