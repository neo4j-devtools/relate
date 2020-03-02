# Testing
This document contains all instructions for testing.

## Setup
All tests run against the [e2e fixtures folder](../e2e/fixtures).

### DBMS
To run tests locally you need to add a Neo4j 4.0 DBMS to the [dbmss folder](../e2e/fixtures/data/neo4j-relate/dbmss) in a folder called "test".
The "test" DBMS needs to have the following credentials:
```
principal: neo4j
credentials: newpassword
```

### JWT Auth Plugin
We require a custom Neo4j [JWT Auth Plugin](https://github.com/neo-technology/neo4j-jwt-addon) for local installations.
Please follow the README to add it to the "test" DBMS.

