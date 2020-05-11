import {v4 as uuid} from 'uuid';
import path from 'path';

import {EnvironmentConfigModel, IDbms} from '../models';
import {ENVIRONMENT_TYPES} from './environment.constants';
import {InvalidConfigError, NotSupportedError, NotFoundError} from '../errors';

import {EnvironmentAbstract} from './environment.abstract';
import {LocalEnvironment} from './local.environment';
import {envPaths} from '../utils';
import {RemoteEnvironment} from './remote.environment';

export async function createEnvironmentInstance(
    config: EnvironmentConfigModel,
    configPath: string,
): Promise<EnvironmentAbstract> {
    let environment: EnvironmentAbstract;
    switch (config.type) {
        case ENVIRONMENT_TYPES.LOCAL:
            environment = new LocalEnvironment(config, configPath);
            break;
        case ENVIRONMENT_TYPES.REMOTE:
            environment = new RemoteEnvironment(config, configPath);
            break;
        default:
            throw new InvalidConfigError(`Environment type ${config.type} not supported`);
    }

    await environment.init();
    return environment;
}

export class TestDbmss {
    static DBMS_CREDENTIALS = 'password';

    dbmsNames: string[] = [];

    environment: EnvironmentAbstract;

    constructor(private filename: string, environment?: EnvironmentAbstract) {
        if (process.env.NODE_ENV !== 'test') {
            throw new NotSupportedError('Cannot use TestDbmss outside of testing environment');
        }

        const config = new EnvironmentConfigModel({
            dbmss: {},
            id: 'test',
            neo4jDataPath: envPaths().data,
            type: ENVIRONMENT_TYPES.LOCAL,
            user: 'test',
        });

        this.environment = environment || new LocalEnvironment(config, 'nowhere');
    }

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `[${shortUUID}] ${path.relative('..', this.filename)}`;

        this.dbmsNames.push(name);
        return name;
    }

    async createDbms(): Promise<IDbms> {
        const version = process.env.TEST_NEO4J_VERSION || '4.0.4';
        const name = this.createName();

        await this.environment.installDbms(name, TestDbmss.DBMS_CREDENTIALS, version);

        const shortUUID = uuid().slice(0, 8);
        const numUUID = Array.from(shortUUID).reduce((sum, char, index) => {
            // Weight char codes before summing them, to avoid collisions when
            // strings contain the same characters.
            return sum + char.charCodeAt(0) * (index + 1);
        }, 0);

        // Increments of 10 to avoid collisions between the 3 different ports,
        // and max offset of 30k.
        const portOffset = (numUUID * 10) % 30000;

        const properties = new Map<string, string>();
        properties.set('dbms.connector.bolt.listen_address', `:${7687 + portOffset}`);
        properties.set('dbms.connector.http.listen_address', `:${7474 + portOffset}`);
        properties.set('dbms.connector.https.listen_address', `:${7473 + portOffset}`);
        properties.set('dbms.backup.listen_address', `:${6362 + portOffset}`);
        await this.environment.updateDbmsConfig(name, properties);

        return this.environment.getDbms(name);
    }

    async teardown(): Promise<void> {
        const uninstallAll = this.dbmsNames.map(async (name) => {
            try {
                await this.environment.stopDbmss([name]);
                await this.environment.uninstallDbms(name);
            } catch (e) {
                if (e instanceof NotFoundError) {
                    return;
                }
                throw e;
            }
        });
        await Promise.all(uninstallAll);
    }
}
