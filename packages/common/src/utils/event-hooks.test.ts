import {registerHookListener, emitHookEvent, deregisterHookListener} from './event-hooks';
import {HOOK_EVENTS} from '../constants';

describe('eventHooks', () => {
    test('single hook', async () => {
        const listener = jest.fn();
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listener);
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'first event');
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'second event');

        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listener);
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'ignored event');

        expect(listener).toHaveBeenCalledTimes(2);
        expect(listener.mock.calls).toEqual([['first event'], ['second event']]);
        expect(listener).not.toHaveBeenCalledWith('ignored event');
    });

    test('multiple hooks', async () => {
        const listenerStart = jest.fn();
        const listenerStop = jest.fn();
        const listenerStop2 = jest.fn();

        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, listenerStart);
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop);
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop2);

        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, 'start');
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'stop');
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'stop again');

        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, listenerStart);
        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop);
        deregisterHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, listenerStop2);

        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_START, 'ignored event');
        await emitHookEvent(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, 'ignored event');

        expect(listenerStart.mock.calls).toEqual([['start']]);
        expect(listenerStop.mock.calls).toEqual([['stop'], ['stop again']]);
        expect(listenerStop2.mock.calls).toEqual([['stop'], ['stop again']]);
    });
});
