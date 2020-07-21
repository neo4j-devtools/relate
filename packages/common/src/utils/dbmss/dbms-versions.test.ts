import fse from 'fs-extra';
import nock from 'nock';
import path from 'path';
import {List} from '@relate/types';

import {discoverNeo4jDistributions, fetchNeo4jVersions} from './dbms-versions';

import {envPaths} from '../env-paths';
import {
    NEO4J_DIST_VERSIONS_URL,
    NEO4J_EDITION,
    NEO4J_ORIGIN,
    NEO4J_DIST_LIMITED_VERSIONS_URL,
} from '../../entities/environments/environment.constants';
import {DBMS_DIR_NAME} from '../../constants';

const neo4jVersionsUrl = new URL(NEO4J_DIST_VERSIONS_URL);
const neo4jLimitedVersionsUrl = new URL(NEO4J_DIST_LIMITED_VERSIONS_URL);

describe('DBMS versions (local environment)', () => {
    test('list cached distributions', async () => {
        const dbmssDataDir = path.join(envPaths().cache, DBMS_DIR_NAME);
        const versions = (await discoverNeo4jDistributions(dbmssDataDir)).toArray();
        expect(versions.length).toEqual(1);
        expect(versions[0].edition).toEqual(NEO4J_EDITION.ENTERPRISE);
        expect(versions[0].origin).toEqual(NEO4J_ORIGIN.CACHED);
        expect(versions[0].dist).toContain(dbmssDataDir);
    });

    test('list no cached distributions', async () => {
        const dbmssTmpDir = path.join(envPaths().tmp, DBMS_DIR_NAME);
        await fse.ensureDir(dbmssTmpDir);
        const versions = (await discoverNeo4jDistributions(dbmssTmpDir)).toArray();
        await fse.remove(dbmssTmpDir);

        expect(versions).toEqual([]);
    });

    test('list online distributions (no limited releases)', async () => {
        nock(neo4jVersionsUrl.origin)
            .get(neo4jVersionsUrl.pathname)
            .reply(200, {
                tags: {latest: '4.0.1'},
                versions: {
                    '3.5.17': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-windows.zip',
                        },
                    },
                    '4.0.0': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-windows.zip',
                        },
                    },
                    '4.0.1': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-windows.zip',
                        },
                    },
                },
            });
        const versions = (await fetchNeo4jVersions()).toArray();
        expect(versions.length).toEqual(2);
        versions.forEach((v) => {
            expect(v.edition).toEqual(NEO4J_EDITION.ENTERPRISE);
            expect(v.origin).toEqual(NEO4J_ORIGIN.ONLINE);
            expect(v.dist).toContain('https://dist.neo4j.org/');
        });
    });

    // @todo will need looking at again once the url is actually available
    // added 4.0.98 and 4.0.99 as placeholders for now as the filter may need to be adjusted after
    test('list online distributions (with limited releases)', async () => {
        nock(neo4jVersionsUrl.origin)
            .get(neo4jVersionsUrl.pathname)
            .reply(200, {
                tags: {latest: '4.0.1'},
                versions: {
                    '3.5.17': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-windows.zip',
                        },
                    },
                    '4.0.0': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.0-windows.zip',
                        },
                    },
                    '4.0.1': {
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.1-windows.zip',
                        },
                    },
                },
            });

        nock(neo4jLimitedVersionsUrl.origin)
            .get(neo4jLimitedVersionsUrl.pathname)
            .reply(200, {
                versions: {
                    '3.5.17-rc.1': {
                        limited: true,
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-rc1-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-rc1-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-3.5.17-rc1-windows.zip',
                        },
                    },
                    '4.0.98': {
                        limited: true,
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.98-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.98-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.98-windows.zip',
                        },
                    },
                    '4.0.99': {
                        limited: true,
                        dist: {
                            linux: 'https://dist.neo4j.org/neo4j-enterprise-4.0.99-unix.tar.gz',
                            mac: 'https://dist.neo4j.org/neo4j-enterprise-4.0.99-unix.tar.gz',
                            win: 'https://dist.neo4j.org/neo4j-enterprise-4.0.99-windows.zip',
                        },
                    },
                },
            });
        const versions = (await fetchNeo4jVersions(true)).toArray();
        expect(versions.length).toEqual(4);
        versions.forEach((v) => {
            if (v.version === '4.0.0' || v.version === '4.0.1') {
                expect(v.origin).toEqual(NEO4J_ORIGIN.ONLINE);
            } else {
                expect(v.origin).toEqual(NEO4J_ORIGIN.LIMITED);
            }
            expect(v.edition).toEqual(NEO4J_EDITION.ENTERPRISE);
            expect(v.dist).toContain('https://dist.neo4j.org/');
        });
    });

    test('list online distribution on network error', async () => {
        nock(neo4jVersionsUrl.origin)
            .get(neo4jVersionsUrl.pathname)
            .replyWithError('something bad happened');
        const versions = await fetchNeo4jVersions();

        expect(versions).toEqual(List.from([]));
    });
});
