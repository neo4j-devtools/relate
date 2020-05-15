import _ from 'lodash';

import {HOOK_EVENTS, Listener} from '../constants';

const REGISTERED_LISTENERS = new Map<HOOK_EVENTS, Set<Listener>>();

export async function emitHookEvent<T = any>(eventName: HOOK_EVENTS, eventData: T): Promise<T> {
    const eventListeners = REGISTERED_LISTENERS.get(eventName) || new Set();
    let returnData = eventData;

    for (const listener of eventListeners) {
        // eslint-disable-next-line no-await-in-loop
        returnData = (await listener(returnData)) || returnData;
    }

    return returnData;
}

export function registerHookListener(eventName: HOOK_EVENTS, listener: Listener) {
    const eventListeners = REGISTERED_LISTENERS.get(eventName);

    REGISTERED_LISTENERS.set(eventName, new Set([...eventListeners, listener]));
}

export function deregisterHookListener(eventName: HOOK_EVENTS, listener: Listener) {
    const eventListeners = REGISTERED_LISTENERS.get(eventName);

    REGISTERED_LISTENERS.set(eventName, new Set(_.without([...eventListeners], listener)));
}
