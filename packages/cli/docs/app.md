`relate app`
============

Manage Graph Apps

* [`relate app:open APPNAME`](#relate-appopen-appname)

## `relate app:open APPNAME`

Open Graph App

```
USAGE
  $ relate app:open APPNAME

OPTIONS
  -D, --dbmsId=dbmsId            The DBMS to automatically connect to
  -L, --log                      If set, log the path instead
  -e, --environment=environment  [default: default] Name of the environment to run the command against
  -u, --user=user                The Neo4j DBMS user to automatically connect with, assuming an access token exists
```

_See code: [dist/commands/app/open.ts](https://github.com/neo-technology/daedalus/blob/v1.0.1-alpha.0/dist/commands/app/open.ts)_
