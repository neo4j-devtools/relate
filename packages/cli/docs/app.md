`relate app`
============

Single page web apps.
Apps can easily connect to any Neo4j which is managed by Relate. Install the @relate/web package for local hosting.

* [`relate app:open [APPNAME]`](#relate-appopen-appname)

## `relate app:open [APPNAME]`

Open app using your default web browser.

```
USAGE
  $ relate app:open [APPNAME]

OPTIONS
  -D, --dbmsId=dbmsId            The DBMS to automatically connect to
  -L, --log                      If set, log the path instead
  -e, --environment=environment  Name of the environment to run the command against
  -p, --project=project          Name of a project context to connect with
  -u, --user=user                The Neo4j DBMS user to automatically connect with, assuming an access token exists

DESCRIPTION
  @relate/web must already be installed and running for this to work.

EXAMPLES
  $ relate app:open
  $ relate app:open app-name
  $ relate app:open app-name -D dbms-to-connect-to -u user-with-access-token
  $ relate app:open app-name -D dbms-to-connect-to -e environment-name -L
```

_See code: [dist/commands/app/open.ts](https://github.com/neo4j-devtools/relate/blob/v1.0.2-alpha.15/dist/commands/app/open.ts)_
