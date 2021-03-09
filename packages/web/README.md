# [@relate](../../README.md)/web

The Neo4j WEB package.

## Table of Content

-   [Installing](#installing)
-   [Documentation](#documentation)
-   [Configuration](#configuration)
-   [API Tokens](#api-tokens)
    -   [Enabling API tokens](#enabling-api-tokens)
    -   [Generating API tokens](#generating-api-tokens)
    -   [Sending requests](#sending-requests)

## Installing

Run these commands to install and start the Relate web server.

```
$ npm install -g @relate/web
$ relate-web start
```

**Note**: You need to create and activate an environment before starting the
server. Check the [install section](../cli/README.md#installing) in the CLI
package to learn how to do that.

By default the server will use port 3000, you can change that port with the
`PORT` environment variable. Example:

```
$ PORT=5000 relate-web start
```

## Documentation

With the server running you can visit the URLs below to access docs for the
schema.

-   GraphQL playground: http://localhost:3000/graphql
-   REST Swagger docs: http://localhost:3000/api-docs

## Configuration

By default the server configuration is picked up from the active environment.

A different environment can be specified when running the web module in a Nestjs
application by using the `defaultEnvironmentNameOrId` option.

## API Tokens

### Enabling API tokens

When creating a new environment, by default the web server will not be secured
with API tokens. This is useful for development or for learning, but in
production environments or when dealing with sensitive data, we strongly
recommend you enable API authentication.

To enable authentication through API tokens on a new environment, use the
`--apiToken` flag when creating the environment through the CLI. Example:

```
$ relate env:init secure-environment --apiToken
```

To enable authentication on an existing environment, you can open the
environment configuration and set the `serverConfig.requiresAPIToken` field to
`true`. Example:

```
$ relate env:open secure-environment
```

```json
{
  "name": "<environmentName>",
  "type": "LOCAL",
  "serverConfig": {
    "publicGraphQLMethods": [...],
    "requiresAPIToken": true
  },
  "id": "<environmentId>",
}
```

### Generating API Tokens

Generated tokens are valid only for a specific client ID and hostname. The
client ID is a name identifying your application, while the hostname is the
address where your application is running (if it's hosted) or the address to the
`@relate/web` server.

To generate an API token you can either use the CLI or common package:

```bash
# @relate/cli
$ relate env:api-token clientId --hostName http://127.0.0.1:3000

# @relate/common
environment.generateAPIToken('http://127.0.0.1:3000', clientId);
```

### Sending Requests

When sending the request, you'll then need to include the following HTTP
headers:

```
X-API-Token: <API Token>
X-Client-Id: <client ID>
```
