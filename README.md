# relate

### Installation

```
$ npm ci
$ npm link # makes the relate command available globally
```

### Configuration

#### Required files

Accounts (see [test folder](./e2e/fixtures/config/neo4j-relate/accounts) for sample):

```sh
$ relate account:init
```

Until we have the ability to add DBMSs we need some files copied to user directories:

DBMSs (see [test folder](./e2e/fixtures/data/neo4j-relate/dbmss) for sample):

```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Data/dbmss
# Linux
~/.local/share/neo4j-relate/dbmss
# Win32
%appdata%\Local\Neo4j\Relate\Data\dbmss
```

#### JWT Auth Plugin

We require a custom Neo4j [JWT Auth Plugin](https://github.com/neo-technology/neo4j-jwt-addon) for local installations.
Please follow the README to add it to any installed DBMSs.

### Paths

Check the [env-paths.ts](./packages/common/src/utils/env-paths.ts) file to see
where files are stored and how to override the default paths.

### Testing

For testing you will need to copy _and_ extract a neo4j archive in the
`./e2e/fixtures/cache/neo4j-relate/` directory. Use version 4.0.4 or set the
`TEST_NEO4J_VERSION` environment variable to whatever version you're testing against.

```
$ npm test
```

Check [TESTING.md](./documentation/TESTING.md) for more information.

### Linting

```
$ npm run lint
```

### Prettifying

```
$ npm run prettify
```
