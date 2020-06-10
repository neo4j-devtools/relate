import _ from 'lodash';

import {Actor, HOOK_EVENTS, Listener} from '../constants';

const REGISTERED_LISTENERS = new Map<HOOK_EVENTS, Set<Listener<any>>>();
const REGISTERED_ACTORS = new Map<HOOK_EVENTS, Set<Actor<any>>>();

export async function emitHookEvent<T = any>(eventName: HOOK_EVENTS, eventData: T): Promise<T> {
    const eventActors = REGISTERED_ACTORS.get(eventName) || new Set();
    const eventListeners = REGISTERED_LISTENERS.get(eventName) || new Set();
    let returnData = eventData;

    for (const actor of eventActors) {
        // eslint-disable-next-line no-await-in-loop
        returnData = (await actor(returnData)) || returnData;
    }

    for (const listener of eventListeners) {
        // eslint-disable-next-line no-await-in-loop
        await listener(returnData);
    }

    return returnData;
}

// To be used only when we want to listen to an event and modify its data.
// The return value of the actor is the new data for the event.
export function registerHookActor<E extends HOOK_EVENTS>(eventName: E, actor: Actor<E>): void {
    const eventActors = REGISTERED_ACTORS.get(eventName) || new Set();

    REGISTERED_ACTORS.set(eventName, new Set([...eventActors, actor]));
}

export function registerHookListener<E extends HOOK_EVENTS>(eventName: E, listener: Listener<E>): void {
    const eventListeners = REGISTERED_LISTENERS.get(eventName) || new Set();

    REGISTERED_LISTENERS.set(eventName, new Set([...eventListeners, listener]));
}

export function deregisterHookActor<E extends HOOK_EVENTS>(eventName: E, actor: Actor<E>): void {
    const eventActors = REGISTERED_ACTORS.get(eventName) || new Set();

    REGISTERED_ACTORS.set(eventName, new Set(_.without([...eventActors], actor)));
}

export function deregisterHookListener<E extends HOOK_EVENTS>(eventName: E, listener: Listener<E>): void {
    const eventListeners = REGISTERED_LISTENERS.get(eventName) || new Set();

    REGISTERED_LISTENERS.set(eventName, new Set(_.without([...eventListeners], listener)));
}
