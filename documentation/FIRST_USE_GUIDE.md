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
`@relate` is currently in alpha and as such not stable. We are working hard to address any known bugs and will definitely find more issues and cases as adoption increases. Please help us make `@relate` better by [contributing](../CONTRIBUTING.md).

## Installation
- **We require NodeJS LTS (v12)** https://nodejs.org/en/
- **We require OpenJDK v11.** https://cdn.azul.com/zulu/bin/ (search for 11.35.13-ca-jdk11.0.5)

Once dependencies are installed you can install the CLI and WEB packages:
```shell script
npm install -g @relate/cli
npm install -g @relate/web
```
We strongly recommend that you install both packages.

## Creating a local environment

All `@relate` operations happen within an "environment" that manages Neo4j resources. You could configure separate environments for development, testing, staging and production. Start with initializing a local environment then setting it as the current environment.

To do so run:
```shell script
relate env:init
```
You will be presented with several prompts, enter the following values:
- `Type`: "Local"
- `Name`: "dev"
- `Authentication`: "No"
- `Restrict GraphQL API`: "No"

Then set the newly created environment as the current environment:

```shell script
relate env:use dev
```

## Installing a DBMS
Currently we only support Neo4j >= 3.5. To install a DBMS, run:
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
You can install Neo4j Browser or Neo4j Bloom by running:
```shell script
relate extension:install
```
And then selecting the appropriate version. We will be adding more/updating extensions as we go.

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
Assuming the `@relate/web` package is running your app should open in a browser tab.

You can also open an app for a specific DBMS by running:
```shell script
# relate app:open <app-name> --dbmsId <nameOrId>
relate app:open neo4j-browser --dbmsId foo
```

## Creating access tokens
`@relate` only supports credentials in the form of access tokens issued by a Neo4j DBMS. To generate an access token you can run:
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
To connect to a remote environment, such as our demo server, you need to initialize a remote environment:
```shell script
relate env:init
```
You will be presented with several prompts, enter the following values:
- `Type`: "Remote"
- `Origin`: "https://relate.neo4jlabs.com" (or any other `@relate` remote)
- `Authentication`: "Yes"
- `Authentication Type`: "Client"
- `Restrict GraphQL API`: "No"

Then you need to authenticate:
```shell script
# relate env:login -e <remote-env-name>
relate env:login -e relate.neo4jlabs
```

Once authenticated, you can now run commands against the remote environment:
```shell script
relate dbms:list -e relate.neo4jlabs
```

