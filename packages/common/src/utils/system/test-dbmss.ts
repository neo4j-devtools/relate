import {v4 as uuid} from 'uuid';
import path from 'path';
import fse from 'fs-extra';

import {EnvironmentConfigModel, IDbms} from '../../models';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME, LocalEnvironment} from '../../environments';

import {NotSupportedError, NotFoundError} from '../../errors';
import {envPaths} from '../env-paths';

export class TestDbmss {
    static DBMS_CREDENTIALS = 'password';

    static NEO4J_VERSION = process.env.TEST_NEO4J_VERSION || '4.0.4';

    dbmsNames: string[] = [];

    environment: EnvironmentAbstract;

    constructor(private filename: string, environment?: EnvironmentAbstract) {
        if (process.env.NODE_ENV !== 'test') {
            throw new NotSupportedError('Cannot use TestDbmss outside of testing environment');
        }

        if (environment) {
            this.environment = environment;
            return;
        }

        const configFilePath = path.join(envPaths().config, ENVIRONMENTS_DIR_NAME, 'test.json');
        // eslint-disable-next-line no-sync
        const config = new EnvironmentConfigModel(fse.readJSONSync(configFilePath));

        this.environment = new LocalEnvironment(config, configFilePath);
    }

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `[${shortUUID}] ${path.relative('..', this.filename)}`;

        this.dbmsNames.push(name);
        return name;
    }

    async createDbms(): Promise<IDbms> {
        const name = this.createName();

        const dbmsId = await this.environment.dbmss.install(name, TestDbmss.DBMS_CREDENTIALS, TestDbmss.NEO4J_VERSION);

        const shortUUID = dbmsId.slice(0, 8);
        const numUUID = Array.from(shortUUID).reduce((sum, char, index) => {
            // Weight char codes before summing them, to avoid collisions when
            // strings contain the same characters.
            return sum + char.charCodeAt(0) * (index + 1);
        }, 0);

        // Increments of 10 to avoid collisions between the 3 different ports,
        // and max offset of 30k.
        const portOffset = (numUUID * 10) % 30000;

        const properties = await this.environment.dbmss.getDbmsConfig(dbmsId);
        properties.set('dbms.connector.bolt.listen_address', `:${7687 + portOffset}`);
        properties.set('dbms.connector.http.listen_address', `:${7474 + portOffset}`);
        properties.set('dbms.connector.https.listen_address', `:${7473 + portOffset}`);
        properties.set('dbms.backup.listen_address', `:${6362 + portOffset}`);
        await properties.flush();

        return this.environment.dbmss.get(name);
    }

    async teardown(): Promise<void> {
        const uninstallAll = this.dbmsNames.map(async (name) => {
            try {
                await this.environment.dbmss.stop([name]);
                await this.environment.dbmss.uninstall(name);
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
