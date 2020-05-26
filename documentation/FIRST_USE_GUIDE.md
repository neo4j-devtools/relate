# First use guide

0. [Disclaimer](#disclaimer)
1. [Installation](#installation)
2. [Creating default environment](#creating-default-environment)
3. [Installing a DBMS](#installing-a-dbms)
4. [Installing Extensions (i.e. "Graph Apps")](#installing-extensions-ie-graph-apps)
5. [Starting the web server](#starting-the-web-server)
6. [Opening Graph Apps](#opening-graph-apps)
7. [Creating Access Tokens](#creating-access-tokens)
8. [Connecting to remote environments](#connecting-to-remote-environments)

## Disclaimer
`@relate` is currently in alpha and as such not stable. We are working hard to address any know bugs such as:
- Authentication errors for remote environments produce strange network errors without indication that re-authentication is required
- Unable to create access-tokens in remote environments
- Remote browser unable to connect due to neo4j encryption not set up
- Errors thrown during DBMS installation does not result in a rollback, meaning corrupt installations can be visible in `dbms:list`

And will definitely find more issues and cases as adoption increases. Please help us make `@relate` better by adding cards to our trello inbox: https://trello.com/b/rS7oLVQZ.

## Installation
- **We require NodeJS LTS (v12)** https://nodejs.org/en/
- **We require OpenJDK v11.** https://cdn.azul.com/zulu/bin/ (search for 11.35.13-ca-jdk11.0.5)

To install `@relate` you need to login to our private npm registry:
```shell script
npm login --scope @relate --registry https://neo.jfrog.io/artifactory/api/npm/npm-local-private
```
Credentials are stored in 1Password under `jfrog reader`

Once authenticated you can install the CLI and WEB packages:
```shell script
npm i -g @relate/cli
npm i -g @relate/web
```
We strongly recommend that you install both packages.

## Creating default environment
You have to create a "default" environment to use `@relate`.
To do so run:
```shell script
relate env:init
```
You will be presented with several prompts, enter the following values:
- `Type`: "Local"
- `Name`: "default"

You can create more environments if you want, but you must have at least one called "default" for the alpha to work as intended.

## Installing a DBMS
Currently we only support Neo4j 4.X enterprise. To install a DBMS, run:
```shell script
relate dbms:install
```

You can then start it by running:
```shell script
relate dbms:start
```

Use the `--help` flag to see additional commands:
```shell script
relate dbms --help
```

## Installing extensions (i.e. "Graph Apps")
You can install Neo4j Browser and Neo4j Bloom by running:
```shell script
relate extension:install neo4j-browser -V 1.0.1
relate extension:install neo4j-bloom -V 1.0.0
```
We will be adding more/updating extensions as we go.

## Starting the web server
To use `@relate` locally you'll probably want to start the web server by running:
```shell script
relate-web start
```
This will expose a local HTTP server with a GraphQL API on http://127.0.0.1:3000. The GraphQL API lets you do most `@relate` operations, please see the playground at http://127.0.0.1:3000/graphql for more information

## Opening Graph Apps
For extensions that support being served over HTTP, you can open them by running:
```shell script
# relate app:open <app-name>
relate app:open neo4j-browser
```
Assuming the WEB package is running your app should open in a browser tab.

You can also open an app for a specific DBMS by running:
```shell script
# relate app:open <app-name> --dbmsId <nameOrId>
relate app:open neo4j-browser --dbmsId foo
```

## Creating access tokens
`@relate` only supports credentials in the form of access tokens issued by neo4j. To generate an access token you can run:
```shell script
# relate dbms:access-token 
relate dbms:access-token
```
The command will generate and store an access token that is automatically passed to other commands.

Now your graph apps can even connect automatically by passing a user
```shell script
# relate app:open <app-name> --dbmsId <nameOrId> --user <dbms-user>
relate app:open neo4j-browser --dbmsId foo --user neo4j
```


## Connecting to remote environments
To connect to a remote environment, such as our demo server, you need to initialize a remote env:
```shell script
relate env:init
```
You will be presented with several prompts, enter the following values:
- `Type`: "Remote"
- `URL`: "https://relate.neo4jlabs.com/" (or any other `@relate` remote)

Then you need to authenticate:
```shell script
# relate env:login -e <remote-env-name>
relate env:login -e relate.neo4jlabs
```

Once authenticated, you can now run commands against the remote environment:
```shell script
relate dbms:list -e relate.neo4jlabs
```

