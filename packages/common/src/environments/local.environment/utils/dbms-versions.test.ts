import fse from 'fs-extra';
import nock from 'nock';
import path from 'path';

import {discoverNeo4jDistributions, fetchNeo4jVersions} from './dbms-versions';

import {envPaths} from '../../../utils';
import {NEO4J_DIST_VERSIONS_URL, NEO4J_EDITION, NEO4J_ORIGIN} from '../../environment.constants';

const neo4jVersionsUrl = new URL(NEO4J_DIST_VERSIONS_URL);

describe('DBMS versions (local environment)', () => {
    test('list cached distributions', async () => {
        const dbmssDataDir = path.join(envPaths().cache, 'dbmss');
        const versions = await discoverNeo4jDistributions(dbmssDataDir);
        expect(versions.length).toEqual(1);
        expect(versions[0].edition).toEqual(NEO4J_EDITION.ENTERPRISE);
        expect(versions[0].origin).toEqual(NEO4J_ORIGIN.CACHED);
        expect(versions[0].dist).toContain(dbmssDataDir);
    });

    test('list no cached distributions', async () => {
        const dbmssTmpDir = path.join(envPaths().tmp, 'dbmss');
        await fse.ensureDir(dbmssTmpDir);
        const versions = await discoverNeo4jDistributions(dbmssTmpDir);
        await fse.remove(dbmssTmpDir);

        expect(versions).toEqual([]);
    });

    test('list online distributions', async () => {
        nock(neo4jVersionsUrl.origin)
            .get(neo4jVersionsUrl.pathname)
            .reply(200, {
                tags: {latest: '4.0.1'},
                versions: {
                    '4.0.1': {
                        dist: {
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-windows.zip',
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                        },
                    },
                    '4.0.0': {
                        dist: {
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-windows.zip',
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                        },
                    },
                    '3.5.17': {
                        dist: {
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-windows.zip',
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                        },
                    },
                },
            });
        const versions = await fetchNeo4jVersions();
        expect(versions.length).toEqual(2);
        versions.forEach((v) => {
            expect(v.edition).toEqual(NEO4J_EDITION.ENTERPRISE);
            expect(v.origin).toEqual(NEO4J_ORIGIN.ONLINE);
            expect(v.dist).toContain('https://dist.neo4j.org/');
        });
    });

    test('list online distribution on network error', async () => {
        nock(neo4jVersionsUrl.origin)
            .get(neo4jVersionsUrl.pathname)
            .replyWithError('something bad happened');
        const versions = await fetchNeo4jVersions();

        expect(versions).toEqual([]);
    });
});
