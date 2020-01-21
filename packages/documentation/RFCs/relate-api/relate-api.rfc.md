- Start Date: (2020-01-15)
- RFC PR: https://github.com/neo-technology/daedalus/pull/1
- Daedalus Issue: (leave this empty)

# Summary
In this RFC, we propose a unified API surface for interacting with the Neo4j platform.
- *As a GraphQL Schema*, allowing HTTP clients access to a typed schema and query language
- *As a CLI*, allowing terminal clients to setup advanced, possibly automated, workflows
- *As a Javascript library*, allowing applications to interact programmatically

Our primary focus is support for Neo4j 4.x and feature parity with the current [@neo4j/relate-api](https://github.com/neo4j-apps/relate-api) schema.

For now we will use the project name "daedalus" until we have found a real name for said API.

# Basic example
## GraphQL
```GraphQL
query GetDBNames {
    useProvider(nameOrId: "local") {
        useDBMS(nameOrId: "neo4j") {
            id,
            dbs {
                name
            }
        }
    }
}
```

## CLI
```shell script
$ daedalus provider use "local" # set context to "local"
$ daedalus dbms use "neo4j" # set current DBMS to "neo4j"
$ daedalus db list | awk '{print $2}' # list names (col 2)
```

## JS
```TypeScript
import Daedalus, {Database} from '@deadalus/core';

const dbs: Promise<Database[]> = Daedalus.useProvider('local')
    .then((provider) => provider.useDBMS('neo4j'))
    .then((dbms) => dbms.listDBs())
```

For more detailed examples, please see our [proposed schema](./relate-api.graphql).

# Motivation
As we are adding more and more ways for consumers (web developers, application developers, system developers) to interact with our core product (local, on-prem, cloud), 
as well as increasing the feature set of our products (clustering, multi-db, transactions), 
we need to ensure that they have access to a homogeneous, extensible, and intuitive API that empowers them to do great work.

The expected outcome of this project is a JavaScript library that allows you to do everything Neo4j Desktop does without the need to install electron. 
Said library should provide extension points to attach custom logic and be usable in code, in the CLI, and over HTTP (as GraphQL).

The user experience should be as similar as possible across environments and allow consumers to build up a "neo4j muscle memory".

# Detailed design
The core deliverable is a JavaScript library (the "toolkit") that allows you to programmatically interact with the Neo4j platform.
In this context, "platform" is defined as the collection of DBMSs Providers (Deskless, Desktop, Aura), Auxiliary Services (IDMS, User data, Graph Apps), and Tooling (drivers, graphql server, plugins).

The toolkit should enable users to safely create and store provider configurations, use a given provider to create, interact, and remove DBMS instances, and for each DBMS create, interact, and drop Databases.
The toolkit should then be exposed as a GraphQL API, as well as a CLI.

The toolkit should be easy to extend using the established dependency injection patterns of [NestJS](https://nestjs.com/).

For more detailed description, please see:
- [Providers, DBMSs, and DBs overview](#TBA)
- [JS Docs](#TBA)
    - [Usage](#TBA)
    - [API Reference](#TBA)
- [GraphQL Docs](#TBA)
    - [Usage](#TBA)
    - [API Reference](#TBA)
- [CLI Docs](#TBA)
    - [Usage](#TBA)
    - [API Reference](#TBA)

Some specific details we'd like to highlight:
- The API is semantically the same regardless of if you are using the JS library, GraphQL API, or CLI
- The concept of Providers make it easy to protect sensitive information such credentials
- NestJS allows for a well known DI pattern that is already established in the community.


# Drawbacks
- This is no small task, and will be delivered in chunks. Prioritizing and scheduling could be tricky, and it is hard to get accurate time estimates
- Introducing new tooling means a lot of documentation to follow, and thus educating consumers and advocates
- It is unclear how much backward compatibility we can offer
- 

# Alternatives

What other designs have been considered? What is the impact of not doing this?

# Adoption strategy

If we implement this proposal, how will existing React developers adopt it? Is
this a breaking change? Can we write a codemod? Should we coordinate with
other projects or libraries?

# How we teach this

What names and terminology work best for these concepts and why? How is this
idea best presented? As a continuation of existing React patterns?

Would the acceptance of this proposal mean the React documentation must be
re-organized or altered? Does it change how React is taught to new developers
at any level?

How should this feature be taught to existing React developers?

# Unresolved questions
- Can we improve/amalgamate the semantics behind Add, remove, VS create, drop, delete
