import {List} from '@relate/types';

import {
    NEO4J_CONFIG_KEYS,
    DEFAULT_NEO4J_BOLT_PORT,
    DEFAULT_NEO4J_HTTP_PORT,
    DEFAULT_NEO4J_HTTPS_PORT,
} from '../../entities/environments';
import {TimeoutError} from '../../errors';
import {IDbms} from '../../models';
import {isUrlAvailable} from '../generic';

export const isDbmsOnline = async (dbms: IDbms): Promise<boolean> => {
    const conf = dbms.config;

    const connectors = List.from([
        [NEO4J_CONFIG_KEYS.BOLT_CONNECTOR, DEFAULT_NEO4J_BOLT_PORT],
        [NEO4J_CONFIG_KEYS.HTTP_CONNECTOR, DEFAULT_NEO4J_HTTP_PORT],
        [NEO4J_CONFIG_KEYS.HTTPS_CONNECTOR, DEFAULT_NEO4J_HTTPS_PORT],
    ]);

    const reachable = await connectors
        .filter(([conn]) => conf.get(conn + NEO4J_CONFIG_KEYS.ENABLED) === 'true')
        .mapEach(([conn, defaultPort]) => {
            const address = conf.get(conn + NEO4J_CONFIG_KEYS.LISTEN_ADDRESS);

            const protocol = conn.includes('https') ? 'https' : 'http';
            const [, port] = (address || defaultPort).split(':');

            const url = `${protocol}://127.0.0.1:${port}`;
            return isUrlAvailable(url);
        })
        .unwindPromises();

    return reachable.toArray().every(Boolean);
};

const sleep = (ms: number): Promise<void> =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export const waitForDbmsToBeOnline = async (dbms: IDbms): Promise<void> => {
    const delay = 1000;
    const maxAttempts = 60;
    let currentAttempt = 0;

    /* eslint-disable no-await-in-loop */
    while (currentAttempt < maxAttempts) {
        const isOnline = await isDbmsOnline(dbms);
        if (isOnline) {
            return;
        }
        await sleep(delay);
        currentAttempt += 1;
    }
    /* eslint-enable no-await-in-loop */

    throw new TimeoutError(`Could not connect to DBMS "${dbms.id}" within 60 seconds`, [
        'Check neo4j.log for more information',
    ]);
};
