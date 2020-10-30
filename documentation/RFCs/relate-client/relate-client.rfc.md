- Start Date: (2020-04-22)
- RFC PR: https://github.com/neo-technology/daedalus/pull/21
- @relate Issue: (leave this empty)

# Summary
Enable frontend applications to seamlessly interact with `@relate` backend using a client library that exposes information such as DBMS connection parameters and more.

# Basic example
Below interactions result in an App Launch Token being created which can be used in URLs to allow apps access to connection information for a given DBMS and user: `/static/neo4j-browser?_appLaunchToken=<token>`

### @relate/cli
Create DBMS access token and launch frontend app for a given DBMS user
```bash
$ relate dbms:access-token foo --principal neo4j --credentials newpassword
$ relate app:launch neo4j-insight --dbmsId foo --principal neo4j
```

### @relate/web
Create DBMS access token for a given DBMS user
```GraphQL
mutation access(
  $accountId: String!,
  $appId: String!,
  $dbmsId: String!,
  $authToken: AuthTokenInput!
) {
  createAccessToken(
    accountId: $accountId,
    appId: $appId,
    dbmsId: $dbmsId,
    authToken: $authToken
  ) 
}
```
Variables
```JSON
{
  "accountId": "test",
  "appId": "foo",
  "dbmsId": "test",
  "authToken": {
    "scheme": "basic",
    "principal": "neo4j",
    "credentials": "newpassword"
  }
}
```

Create App Launch Token for a given DBMS user and access token
```GraphQL
mutation launch(
  $accountId: String!,
  $appId: String!,
  $dbmsId: String!,
  $principal: String!,
  $accessToken: String!
) {
  createAppLaunchToken(
    accountId: $accountId,
    appId: $appId,
    dbmsId: $dbmsId,
    principal: $principal,
    accessToken: $accessToken
  ) {
    token
    path
  } 
}
```
Variables
```JSON
{
  "accountId": "test",
  "appId": "foo",
  "dbmsId": "test",
  "principal": "neo4j",
  "accessToken": "<access-token>"
}
```
where `path` points to the hosted version of the provided app, eg. `/static/neo4j-browser?_appLaunchToken=<token>`

Parsing a launch token
```GraphQL
query parseLaunchToken($appId: String!, $launchToken: String!) {
    appLaunchData(appId: $appId, launchToken: $launchToken) {
        accessToken
        dbms {
            id
            name
            connectionUri
        }
        principal
    }
}
```
Variables
```JSON
{
  "appId": "foo",
  "launchToken": "<app-launch-token>"
}
```


### @relate/client
Consume App Launch Token provided in URL `/static/neo4j-browser?_appLaunchToken=<token>`
```JSX
...

import {RelateClient} from '@relate/client';

...


  componentDidMount() {
    const launchToken = new URLSearchParams(location.search).get('_appLaunchToken');

    if (!launchToken) {
      return;
    }

    this.relateClient.getAppLaunchData(launchToken)
      .then(({accessToken, principal}) => {
        if (accessToken && principal) {
          this.onConnectModalSubmit(principal, accessToken);
        }
      })
  }

```

# Motivation
The primary reason for doing this is to allow frontend applications to interact smoothly with the `@relate` backend. To this end we want to provide a simple, secure way of passing DBMS connection information as well as other meta to apps without incurring significant overhead to the developer.

The main use-case today is to allow apps such as Neo4j Browser to open and automatically connect to a running DBMS without user interaction. In the future we can imagine passing additional information to further inform apps such as Neo4j Browser what type of interaction is expected.

A secondary use-case is to allow graph apps to launch each other. One can imagine a situation where Neo4j Browser uses it's own DBMS access token to generate an App Launch Token for Neo4j Insight (Bloom). This would allow browser to deeplink a user to bloom without them having to sign in to the DBMS again.

# Detailed design
Underpinning this functionality is the use of JWT tokens inside a Neo4j DBMSs. To this end we have for the moment created an enterprise edition plugin that generates JWT tokens for a provided credential pair.

Once an access token is created, app launch tokens can be generated via the CLI or GraphQL APIs.

Apps that support these tokens, by relying on our `@relate/client` library or a home-rolled implementation, can then send them back to the GraphQL server to get the contents.

Tokens are validated using a combination of the `@relate` instance used to create it, the account in use, as well as the app initiating the request.

Should any of these be invalid, and further should the DBMS access token be invalid, an error will be thrown. Otherwise the parsed contents of the launch token is returned.

```TypeScript
interface IAppLaunchToken {
    accountId: string;
    dbmsId: string;
    principal: string;
    appId: string;
    accessToken: string;
}
```

# Drawbacks
Overall there is no major reason not to pursue this path. However there are security implications that need to be considered.

- We are passing some form of credentials to the client, should we fail to ensure that only JWT access tokens are provided we could leak passwords.
- It goes without saying that this requires third-party applications to simply accept our way of handling connections.
- It could be difficult to provide good error messages when this process fails, as depending on the error sensitive data might be involved.

# Alternatives
N/A

# Adoption strategy
In order to encourage adoption we would most likely need to create some thin, application framework specific, libaries build on the `@relate/client` package.

Without researching it further the following frameworks stand out:
- [Angular](https://angular.io/)
- [React](https://reactjs.org/)
- [Vue.js](https://vuejs.org/)
