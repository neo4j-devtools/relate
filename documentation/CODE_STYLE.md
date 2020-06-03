# Code style

List of rules we should keep in mind when writing code in this repo.

-   Don't import barrels from the folder you're in:

```typescript
// Don't do this
import {download, extract} from '.';

// Do this instead
import {download} from './download';
import {extract} from './download';
```

-   Don't export barrels from other folders:

```typescript
// Don't do this if environment is a directory
export * from './environment';
```
