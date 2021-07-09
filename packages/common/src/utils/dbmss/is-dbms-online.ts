import {List} from '@relate/types';
import PCancelable from 'p-cancelable';

import {
    NEO4J_CONFIG_KEYS,
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HTTP_PORT,
    DEFAULT_NEO4J_HTTPS_PORT,
    EnvironmentAbstract,
} from '../../entities/environments';
import {TimeoutError} from '../../errors';
import {IDbms} from '../../models';
import {emitHookEvent} from '../event-hooks';
import {isUrlAvailable} from '../generic';
import {DBMS_STATUS, HOOK_EVENTS, MAX_DBMS_TO_BE_STOPPED_ATTEMPTS} from '../../constants';

export const isDbmsOnline = async (dbms: IDbms): Promise<boolean> => {
    const conf = dbms.config;

    const connectors = List.from([
        [NEO4J_CONFIG_KEYS.BOLT_CONNECTOR, DEFAULT_NEO4J_BOLT_PORT],
        [NEO4J_CONFIG_KEYS.HTTP_CONNECTOR, DEFAULT_NEO4J_HTTP_PORT],
        [NEO4J_CONFIG_KEYS.HTTPS_CONNECTOR, DEFAULT_NEO4J_HTTPS_PORT],
    ]);

    const reachable = await connectors
        .filter(([conn]) => conf.get(conn + NEO4J_CONFIG_KEYS.ENABLED) === 'true')
        .mapEach(async ([conn, defaultPort]) => {
            const address = conf.get(conn + NEO4J_CONFIG_KEYS.LISTEN_ADDRESS);

            const protocol = conn.includes('https') ? 'https' : 'http';
            const [, port] = (address || defaultPort).split(':');

            const url = `${protocol}://127.0.0.1:${port}`;
            // const isAvail = await isUrlAvailable(url);
            // console.log('++url', url, isAvail);
            return isUrlAvailable(url);
        })
        .unwindPromises();
    console.log('++reachable', reachable.toArray());
    // console.log('++reachable', reachable.toArray().every(Boolean));

    return reachable.toArray().every(Boolean);
};

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export const waitForDbmsToBeOnline = (
    dbms: IDbms,
    _environment?: EnvironmentAbstract,
    maxAttempts?: number,
): PCancelable<unknown> =>
    new PCancelable((res, rej, onCancel) => {
        let cancelled = false;
        const waitForDbmsToBeOnlineCheck = async (
            dbms: IDbms,
            _environment?: EnvironmentAbstract,
            maxAttempts?: number,
        ): Promise<void> => {
            const delay = 1000;
            let currentAttempt = 0;

            // if (environment) {
            //     const [{status}] = await environment.dbmss.info([dbms.id]);
            //     if (status === DBMS_STATUS.STOPPED) {
            //         throw new NotAllowedError(`Dbms ${dbms.id} is not started`);
            //     }
            // }

            /* eslint-disable no-await-in-loop */
            while (!cancelled && (!maxAttempts || currentAttempt < maxAttempts)) {
                const isOnline = await isDbmsOnline(dbms);
                console.log('++isOnline', isOnline);
                if (isOnline) {
                    console.log('++isOnline RETURN');
                    return;
                }
                await sleep(delay);
                currentAttempt += 1;
                // This will allow a user defined maxAttempts value to be used via a
                // hook actor, if the current maxAttempts is not adequate, e.g. from
                // an input or prompt in the Desktop UI.
                const {maxAttempts: returnedMaxAttempts} = await emitHookEvent(HOOK_EVENTS.DBMS_TO_BE_ONLINE_ATTEMPTS, {
                    maxAttempts,
                    currentAttempt,
                });
                maxAttempts = returnedMaxAttempts;
            }
            console.log('++OUTSIDE LOOP');
            /* eslint-enable no-await-in-loop */

            throw new TimeoutError(`Could not connect to DBMS "${dbms.id}"`, ['Check neo4j.log for more information']);
        };

        onCancel(() => {
            cancelled = true;
        });
        waitForDbmsToBeOnlineCheck(dbms, _environment, maxAttempts)
            .then(res)
            .catch(rej);
    });

export const waitForDbmsToStop = async (environment: EnvironmentAbstract, dbmsId: string): Promise<void> => {
    const delay = 1000;
    const maxAttempts = MAX_DBMS_TO_BE_STOPPED_ATTEMPTS;
    let currentAttempt = 0;

    /* eslint-disable no-await-in-loop */
    while (currentAttempt < maxAttempts) {
        const [{status}] = await environment.dbmss.info([dbmsId]);
        if (status === DBMS_STATUS.STOPPED) {
            return;
        }
        await sleep(delay);
        currentAttempt += 1;
    }
    /* eslint-enable no-await-in-loop */

    throw new TimeoutError(`DBMS "${dbmsId}" is still running`, ['Check neo4j.log for more information']);
};
