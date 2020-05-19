# Event Hooks
Event hooks allows for reacting to events occurring within the `@relate` applications by registering listeners (much like the `addEventListener()` API in the DOM).

We are continuously adding more events and as such refer to the [HOOK_EVENT enum](../packages/common/src/constants.ts).

### Emitting an event
You can emit an event anywhere inside the NodeJS process:
```TypeScript
import {emitHookEvent} from '@relate/common'; 

const eventValues = {}
const updated = await emitHookEvent('foo', eventValues);
```

### Listening for an event
You can listen for an event anywhere inside the NodeJS process:
```TypeScript
import {registerHookListener, deregisterHookListener} from '@relate/common'; 

const listener = (value) => ({...value, updated: true}) 

// register listener
registerHookListener('foo', listener);

// deregister listener
deregisterHookListener('foo', listener);
```
