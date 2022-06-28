`relate app`
============

Single page web apps.
Apps can easily connect to any Neo4j which is managed by Relate. Install the @relate/web package for local hosting.

* [`relate app open [APPNAME]`](#relate-app-open-appname)

## `relate app open [APPNAME]`

Open app using your default web browser.

```
USAGE
  $ relate app open [APPNAME] [-e <value>] [-D <value>] [-L] [-u <value>] [-p <value>]

FLAGS
  -D, --dbmsId=<value>       The DBMS to automatically connect to
  -L, --log                  If set, log the path instead
  -e, --environment=<value>  Name of the environment to run the command against
  -p, --project=<value>      Name of a project context to connect with
  -u, --user=<value>         The Neo4j DBMS user to automatically connect with, assuming an access token exists

DESCRIPTION
  Open app using your default web browser.

  @relate/web must already be installed and running for this to work.

EXAMPLES
  $ relate app:open

  $ relate app:open app-name

  $ relate app:open app-name -D dbms-to-connect-to -u user-with-access-token

  $ relate app:open app-name -D dbms-to-connect-to -e environment-name -L
```
