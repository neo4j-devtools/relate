import {DBMS_SERVER_STATUS, DBMS_STATUS, HOOK_EVENTS} from '../../constants';
import {LocalEnvironment} from '../../entities/environments';
import {DbConnectionModel, IDbConnection} from '../../models';
import {emitHookEvent} from '../event-hooks';
import {waitForDbmsToStop} from './is-dbms-online';
import {neo4jCmd} from './neo4j-cmd';
import {winNeo4jStop} from './neo4j-process-win';

export async function signalStop(environment: LocalEnvironment, nameOrId: string): Promise<string> {
    const {id} = await environment.dbmss.getDbms(nameOrId);

    if (process.platform === 'win32') {
        return winNeo4jStop(environment.dbmss.getDbmsRootPath(id));
    }

    return neo4jCmd(environment.dbmss.getDbmsRootPath(id), 'stop');
}

export async function procedureStop(environment: LocalEnvironment, dbConnection: IDbConnection): Promise<void> {
    const conn = new DbConnectionModel(dbConnection);
    const dbms = await environment.dbmss.get(conn.dbmsNameOrId, true);

    if (dbms.status === DBMS_STATUS.STOPPED) {
        return;
    }

    if (dbms.serverStatus !== DBMS_SERVER_STATUS.ONLINE) {
        await emitHookEvent(HOOK_EVENTS.DEBUG, `DBMS "${dbms.id}" is unreachable, falling back to signal stop`);
        await signalStop(environment, dbms.id);
        return;
    }

    const driver = await environment.dbmss.getDriverInstance(dbms.id, {
        credentials: conn.accessToken,
        principal: conn.dbmsUser,
        scheme: 'basic',
    });

    const session = driver.session();

    // Not awaiting this session on purpose as when it runs correctly the DBMS
    // will shut down before we can get any response (leading to a timeout of
    // the driver).
    session.run('CALL unsupported.dbms.shutdown()').catch(async (error) => {
        const message = error.message || '';

        if (message.includes('No routing servers available') || message.includes('Connection was closed by server')) {
            // The call worked as intended and either the DBMS is stopped and
            // the driver timed out, or we closed the connection because we
            // detected that the DBMS is stopped.
            return;
        }

        if (message.includes('There is no procedure with the name `unsupported.dbms.shutdown`')) {
            await emitHookEvent(
                HOOK_EVENTS.DEBUG,
                `DBMS "${dbms.id}" does not support the shutdown procedure, falling back to signal stop`,
            );
            await signalStop(environment, dbms.id);
            return;
        }

        await emitHookEvent(
            HOOK_EVENTS.DEBUG,
            `Error while calling the shutdown procedure on "${dbms.id}", falling back to signal stop: \n${message}`,
        );
        await signalStop(environment, dbms.id);
    });

    await waitForDbmsToStop(environment, dbms.id);

    // The driver needs to be closed to avoid blocking the Relate process with
    // the potentially open session/request.
    await driver.close();
}
