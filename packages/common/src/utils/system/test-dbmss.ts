import {v4 as uuid} from 'uuid';
import path from 'path';
import fse from 'fs-extra';
import {Dict} from '@relate/types';

import {EnvironmentConfigModel, IDbmsInfo} from '../../models';
import {EnvironmentAbstract, ENVIRONMENTS_DIR_NAME, LocalEnvironment, NEO4J_EDITION} from '../../entities/environments';

import {NotFoundError, NotSupportedError} from '../../errors';
import {envPaths} from '../env-paths';
import {DBMS_DIR_NAME} from '../../constants';
import {TEST_NEO4J_VERSIONS, TEST_NEO4J_CREDENTIALS} from './test-environment';

export class TestDbmss {
    static DBMS_CREDENTIALS = TEST_NEO4J_CREDENTIALS;

    static NEO4J_VERSION = TEST_NEO4J_VERSIONS.default;

    static NEO4J_EDITION: NEO4J_EDITION = Dict.from(NEO4J_EDITION)
        .values.find((e) => e === process.env.TEST_NEO4J_EDITION)
        .getOrElse(NEO4J_EDITION.ENTERPRISE);

    static ARCHIVE_PATH = path.join(envPaths().cache, DBMS_DIR_NAME, `neo4j-enterprise-${TestDbmss.NEO4J_VERSION}.tgz`);

    dbmsNames: string[] = [];

    environment: EnvironmentAbstract;

    static async init(filename: string, environment?: EnvironmentAbstract): Promise<TestDbmss> {
        // eslint-disable-next-line no-restricted-syntax
        const dbmss = new TestDbmss(filename, environment);
        await dbmss.environment.init();
        return dbmss;
    }

    constructor(private filename: string, environment?: EnvironmentAbstract) {
        if (process.env.NODE_ENV !== 'test') {
            throw new NotSupportedError('Cannot use TestDbmss outside of testing environment');
        }

        if (environment) {
            this.environment = environment;
            return;
        }

        const configPath = path.join(envPaths().config, ENVIRONMENTS_DIR_NAME, 'test.json');
        // eslint-disable-next-line no-sync
        const configJson = fse.readJSONSync(configPath);
        const config = new EnvironmentConfigModel({
            ...configJson,
            configPath,
            name: filename,
        });

        this.environment = new LocalEnvironment(config);
    }

    createName(): string {
        const shortUUID = uuid().slice(0, 8);
        const name = `[${shortUUID}] ${path.relative('..', this.filename)}`;

        this.dbmsNames.push(name);
        return name;
    }

    async createDbms(edition: NEO4J_EDITION = NEO4J_EDITION.ENTERPRISE): Promise<IDbmsInfo> {
        const name = this.createName();

        const {id: dbmsId} = await this.environment.dbmss.install(
            name,
            TestDbmss.NEO4J_VERSION,
            edition || TestDbmss.NEO4J_EDITION,
            TestDbmss.DBMS_CREDENTIALS,
        );

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
        await fse.remove(path.resolve(path.join(this.environment.dataPath, 'test-db.dump')));
    }
}
