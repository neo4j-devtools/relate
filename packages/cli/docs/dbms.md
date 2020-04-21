`relate dbms`
=============



* [`relate dbms:access-token [DBMSID]`](#relate-dbmsaccess-token-dbmsid)
* [`relate dbms:install [NAME]`](#relate-dbmsinstall-name)
* [`relate dbms:list`](#relate-dbmslist)
* [`relate dbms:start [DBMSIDS]`](#relate-dbmsstart-dbmsids)
* [`relate dbms:status [DBMSIDS]`](#relate-dbmsstatus-dbmsids)
* [`relate dbms:stop [DBMSIDS]`](#relate-dbmsstop-dbmsids)
* [`relate dbms:uninstall [DBMSID]`](#relate-dbmsuninstall-dbmsid)

## `relate dbms:access-token [DBMSID]`

```
USAGE
  $ relate dbms:access-token [DBMSID]

OPTIONS
  -A, --account=account          Account to run the command against
  -c, --credentials=credentials  (required)
  -p, --principal=principal      (required)
```

_See code: [dist\commands\dbms\access-token.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\access-token.ts)_

## `relate dbms:install [NAME]`

```
USAGE
  $ relate dbms:install [NAME]

OPTIONS
  -A, --account=account          Account to run the command against
  -C, --credentials=credentials  Initial password to set
  -V, --version=version          Version to install
```

_See code: [dist\commands\dbms\install.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\install.ts)_

## `relate dbms:list`

```
USAGE
  $ relate dbms:list

OPTIONS
  -A, --account=account   Account to run the command against
  --columns=columns       only show provided columns (comma-separated)
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [dist\commands\dbms\list.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\list.ts)_

## `relate dbms:start [DBMSIDS]`

```
USAGE
  $ relate dbms:start [DBMSIDS]

OPTIONS
  -A, --account=account  Account to run the command against
```

_See code: [dist\commands\dbms\start.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\start.ts)_

## `relate dbms:status [DBMSIDS]`

```
USAGE
  $ relate dbms:status [DBMSIDS]

OPTIONS
  -A, --account=account   Account to run the command against
  --columns=columns       only show provided columns (comma-separated)
  --filter=filter         filter property by partial string matching, ex: name=foo
  --no-header             hide table header from output
  --no-truncate           do not truncate output to fit screen
  --output=csv|json|yaml  output in a more machine friendly format
  --sort=sort             property to sort by (prepend '-' for descending)
```

_See code: [dist\commands\dbms\status.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\status.ts)_

## `relate dbms:stop [DBMSIDS]`

```
USAGE
  $ relate dbms:stop [DBMSIDS]

OPTIONS
  -A, --account=account  Account to run the command against
```

_See code: [dist\commands\dbms\stop.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\stop.ts)_

## `relate dbms:uninstall [DBMSID]`

```
USAGE
  $ relate dbms:uninstall [DBMSID]

OPTIONS
  -A, --account=account  Account to run the command against
```

_See code: [dist\commands\dbms\uninstall.ts](https://github.com/neo-technology/daedalus/blob/v1.0.0/dist\commands\dbms\uninstall.ts)_
