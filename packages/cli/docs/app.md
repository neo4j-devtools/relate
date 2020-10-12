`relate app`
============

Manage Graph Apps

* [`relate app:open [APPNAME]`](#relate-appopen-appname)

## `relate app:open [APPNAME]`

Open Graph App

```
USAGE
  $ relate app:open [APPNAME]

OPTIONS
  -D, --dbmsId=dbmsId            The DBMS to automatically connect to
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          Name of a project context to connect with
  -u, --user=user                The Neo4j DBMS user to automatically connect with, assuming an access token exists

EXAMPLES
  $ relate app:open
  $ relate app:open app-name
  $ relate app:open app-name -D dbms-to-connect-to -u user-with-access-token
  $ relate app:open app-name -D dbms-to-connect-to -e environment-name -L
```

_See code: [dist/commands/app/open.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.11/dist/commands/app/open.ts)_
