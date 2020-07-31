# relate
Just want to use it? See our [First use guide](./documentation/FIRST_USE_GUIDE.md) instead.


### Installation

```
$ npm ci
$ npm link # makes the relate command available globally
```

### Configuration

#### Required files

Environments (see [test folder](./e2e/fixtures/config/neo4j-relate/environments) for sample):

```sh
$ relate environment:init
```

### Paths

Check the [env-paths.ts](./packages/common/src/utils/env-paths.ts) file to see
where files are stored and how to override the default paths.

### Testing
Uses version 4.0.4 or set the `TEST_NEO4J_VERSION` environment variable to whatever version you're testing against.

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

### Generate documentation

```
$ npm run generate:docs
```
