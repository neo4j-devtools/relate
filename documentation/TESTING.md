# Testing
This document contains all instructions for testing.

## Setup

All tests run against the [e2e fixtures folder](../e2e/relate%20fixtures).

### DBMS
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
