# @relate

A framework to quickly set up and manage Neo4j DBMS instances and related
entities. Provides the same core features as Neo4j Desktop but through
programmatic interfaces.

Some examples of things that can be done with Relate:

-   Installing Neo4j DBMSs with their required Java runtime.
-   Handle lifecycle operations (ie. start, stop, retrieving process and server status).
-   DBMS backups and upgrades.
-   Creating JWT access tokens that can be used instead of passwords.
-   Managing Neo4j Desktop projects.
-   Installing and launching graph apps or extensions.

## Table of Contents

-   [Getting Started](#getting-started)
-   [Main Concepts](#main-concepts)
-   [Getting Help](#getting-help)
-   [Contributing](#contributing)

## Getting Started

The Relate framework offers a few different APIs with the same functionality,
you can find a getting started guide in each package's README.

[**@relate/common**](./packages/common/README.md) - This is the core of the
framework. A Typescript library that exposes Nest.js modules, types, and testing
utilities. All other Relate surfaces are wrappers of this library.

[**@relate/cli**](./packages/cli/README.md) - Lets you do everything you can do
in the common package, but from the command line. The autocompletion and
optional interactive prompts make it easy to use to try out functionality.

[**@relate/web**](./packages/web/README.md) - Web server that exposes both
GraphQL and REST endpoints. This server is available both as a standalone app
and as a NestJS module.

## Main Concepts

### Environment

In Relate, data is organized through environments. An environment can be either
local or remote. Local environments will store all data in your filesystem,
while remote environments are expected to interact with an instance of
`@relate/web` hosted somewhere else.

You can have multiple environments of either type and in the case of the local
environment, you can configure each environment to be stored anywhere in your
filesystem.

### DBMS

Whenever we refer to a DBMS (database management system) in the framework, we
refer to an instance of the Neo4j DBMS. Starting from Neo4j 4.0 each DBMS can
contain multiple databases.

### Project

A project in Relate is a folder with some extra metadata and with possible
associations to databases or DBMSs.

## Contributing

If you'd like to contribute, please read our [contributing guidelines](./CONTRIBUTING.md).
