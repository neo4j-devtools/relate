import {registerHookListener, emitHookEvent, deregisterHookListener} from './event-hooks';
import {HOOK_EVENTS} from '../constants';

describe('eventHooks', () => {
    test('single hook', () => {
        const listener = jest.fn();
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listener);
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'first event');
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'second event');

        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listener);
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'ignored event');

        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener.mock.calls).toEqual([['first event'], ['second event']]);
        expect(listener).not.toHaveBeenCalledWith('ignored event');
    });

    test('multiple hooks', () => {
        const calls: {[event: string]: any[]} = {
            listenerStart: [],
            listenerStop: [],
            listenerStop2: [],
        };
        const listenerStart = (...args: any[]) => calls.listenerStart.push(args);
        const listenerStop = (...args: any[]) => calls.listenerStop.push(args);
        const listenerStop2 = (...args: any[]) => calls.listenerStop2.push(args);

        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, listenerStart);
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop);
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop2);

        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, 'start');
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'stop');
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'stop again');

        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, listenerStart);
        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop);
        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop2);

        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, 'ignored event');
        emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'ignored event');

        expect(calls.listenerStart).toEqual([['start']]);
        expect(calls.listenerStop).toEqual([['stop'], ['stop again']]);
        expect(calls.listenerStop2).toEqual([['stop'], ['stop again']]);
    });
});
