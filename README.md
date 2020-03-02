# relate

### Installation
```
$ npm ci
```

### Configuration

#### Required files
Until we have the ability to add Accounts and DBMSs we need some files copied to user directories:

Accounts (see [test folder](./e2e/fixtures/config/neo4j-relate/accounts) for sample):
```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Config/accounts
# Linux
~/.config/neo4j-relate/accounts
# Win32
%appdata%\Roaming\Neo4j\Relate\Config\accounts
```

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

### Testing
```
$ npm test
```

### Linting
```
$ npm run lint
```

### Prettifying
```
$ npm run prettify
```
