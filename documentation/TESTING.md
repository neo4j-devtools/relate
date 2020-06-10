# Testing

This document contains all instructions for testing.

## Setup

All tests run against the [e2e fixtures folder](../e2e/fixtures).

### DBMS

For testing you will need to copy _and_ extract a neo4j archive in the
`./e2e/fixtures/cache/neo4j-relate/` directory. Use version 4.0.4 or set the
`TEST_NEO4J_VERSION` environment variable to whatever version you're testing against.

Tests are run concurrently, so never assume an exact amount of DBMSs installed at
any given point in your tests. You can use `TestDbmss` for installing new DBMSs
and for cleaning them up after tests are run.

```typescript
import {TestDbmss} from '@relate/common';

// ...

let dbmss: TestDbmss;
let uniqueDbmsName: string;

beforeAll(async () => {
    // If you want to use a specific environment you can specify it as
    // the second argument.
    dbmss = await TestDbmss.init(__filename);
    uniqueDbmsName = await dbmss.createDbms();
});

afterAll(async () => {
    await dbmss.teardown();
});

// ...
```

### JWT Auth Plugin

We require a custom Neo4j [JWT Auth Plugin](https://github.com/neo-technology/neo4j-jwt-addon) for local installations.
Please follow the README to add it to the "test" DBMS.
