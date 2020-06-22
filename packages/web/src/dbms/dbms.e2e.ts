import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {ConfigModule} from '@nestjs/config';
import request from 'supertest';
import {
    TestDbmss,
    IDbms,
    DBMS_STATUS,
    NEO4J_DIST_VERSIONS_URL,
    NEO4J_EDITION,
    NEO4J_ORIGIN,
    IDbmsVersion,
} from '@relate/common';
import nock from 'nock';

import configuration from '../configs/dev.config';
import {WebModule} from '../web.module';
let TEST_DBMS_NAME: string;
const TEST_APP_ID = 'foo';
const TEST_DB_NAME = 'testDb';

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const HTTP_OK = 200;

const queryBody = (query: string, variables?: {[key: string]: any}): {[key: string]: any} => ({
    query,
    variables: {
        dbmsName: TEST_DBMS_NAME,
        dbmsNames: [TEST_DBMS_NAME],
        environmentNameOrId: 'test',
        ...variables,
    },
});

const neo4jVersionsUrl = new URL(NEO4J_DIST_VERSIONS_URL);

describe('DBMSModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;
    let TEST_DBMS_ACCESS_TOKEN: string;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {name} = await dbmss.createDbms();

        TEST_DBMS_NAME = name;

        const module = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    load: [configuration],
                }),
                WebModule,
            ],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    afterAll(() => dbmss.teardown());

    describe('dbms stopped', () => {
        test('/graphql listDbmss', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDBMSSs($environmentNameOrId: String) {
                            listDbmss(environmentNameOrId: $environmentNameOrId) {
                                id,
                                name,
                                description
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {listDbmss} = res.body.data;
                    expect(listDbmss.map(({name}: IDbms) => name)).toContain(TEST_DBMS_NAME);
                });
        });

        test('/graphql infoDbmss (stopped DBMS)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query InfoDBMSSs($environmentNameOrId: String, $dbmsNames: [String!]!) {
                            infoDbmss(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsNames) {
                                name
                                status
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {infoDbmss} = res.body.data;
                    expect(infoDbmss[0].name).toEqual(TEST_DBMS_NAME);
                    expect(infoDbmss[0].status).toEqual(DBMS_STATUS.STOPPED);
                });
        });

        test('/graphql infoDbmss (non existent environment)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query InfoDBMSs {
                            infoDbmss(environmentNameOrId: "non-existent", dbmsIds: ["test"]) {
                                name
                                status
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toBe('Environment "non-existent" not found');
                });
        });

        test('/graphql infoDbmss (non existent DBMS)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query InfoDBMSs($environmentNameOrId: String) {
                            infoDbmss(environmentNameOrId: $environmentNameOrId, dbmsIds: ["non-existent"]) {
                                name
                                status
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toBe('DBMS "non-existent" not found');
                });
        });

        test('/graphql listDbmsVersions', () => {
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
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDbmsVersions {
                            listDbmsVersions {
                                edition
                                version
                                origin
                                dist
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {listDbmsVersions} = res.body.data;

                    expect(listDbmsVersions.length).toEqual(3);
                    listDbmsVersions.forEach((v: IDbmsVersion) => {
                        if (v.origin === NEO4J_ORIGIN.CACHED) {
                            expect(v.version).toEqual(TestDbmss.NEO4J_VERSION);
                        } else {
                            expect(v.origin).toEqual(NEO4J_ORIGIN.ONLINE);
                            expect(v.dist).toContain('https://dist.neo4j.org/');
                        }
                        expect(v.edition).toEqual(NEO4J_EDITION.ENTERPRISE);
                        expect(v.version).not.toEqual('3.5.17');
                    });
                });
        });

        test('/graphql createDb (no running dbms)', () => {
            const accessToken = 'someTokenValue1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation CreateDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                createDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Cannot connect to stopped DBMS.');
                });
        });

        test('/graphql dropDb (no running dbms)', () => {
            const accessToken = 'someTokenValue1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation DropDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                dropDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Cannot connect to stopped DBMS.');
                });
        });

        test('/graphql listDbs (no running dbms)', () => {
            const accessToken = 'someTokenValue1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDbs($dbmsId: String!, $user: String!, $accessToken: String!) {
                                listDbs(dbmsId: $dbmsId, user: $user, accessToken: $accessToken) {
                                    name,
                                    role,
                                    requestedStatus,
                                    currentStatus,
                                    error,
                                    default
                                }
                            }`,
                        {
                            user: 'neo4j',
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Cannot connect to stopped DBMS.');
                });
        });
    });

    describe('dbms started', () => {
        test('/graphql startDbmss', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation StartDBMSSs($environmentNameOrId: String, $dbmsNames: [String!]!) {
                            startDbmss(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsNames)
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {startDbmss} = res.body.data;

                    if (process.platform === 'win32') {
                        expect(startDbmss[0]).toContain('Neo4j service started');
                    } else {
                        expect(startDbmss[0]).toContain('Directories in use');
                        expect(startDbmss[0]).toContain('Starting Neo4j');
                        expect(startDbmss[0]).toContain('Started neo4j (pid');
                    }
                });
        });

        test('/graphql infoDbmss (started DBMS)', async () => {
            // set access token
            TEST_DBMS_ACCESS_TOKEN = await dbmss.environment.dbmss.createAccessToken(TEST_APP_ID, TEST_DBMS_NAME, {
                credentials: TestDbmss.DBMS_CREDENTIALS,
                principal: 'neo4j',
                scheme: 'basic',
            });

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query InfoDBMSs($environmentNameOrId: String, $dbmsNames: [String!]!) {
                            infoDbmss(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsNames) {
                                name
                                status
                            }
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {infoDbmss} = res.body.data;
                    expect(infoDbmss[0].name).toEqual(TEST_DBMS_NAME);
                    expect(infoDbmss[0].status).toEqual(DBMS_STATUS.STARTED);
                });
        });

        test('/graphql accessDbms (started DBMS)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation AccessDBMS(
                            $environmentNameOrId: String,
                            $dbmsName: String!,
                            $authToken: AuthTokenInput!,
                            $appName: String!
                        ) {
                            createAccessToken(
                                environmentNameOrId: $environmentNameOrId,
                                dbmsId: $dbmsName,
                                appName: $appName,
                                authToken: $authToken
                            )
                        }`,
                        {
                            appName: TEST_APP_ID,
                            authToken: {
                                credentials: TestDbmss.DBMS_CREDENTIALS,
                                principal: 'neo4j',
                                scheme: 'basic',
                            },
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {createAccessToken} = res.body.data;
                    expect(createAccessToken).toEqual(expect.stringMatching(JWT_REGEX));
                });
        });

        test('/graphql createDb (invalid accessToken)', () => {
            const accessToken = 'invalidAccessToken1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation CreateDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                createDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Unable to connect to DBMS');
                });
        });

        test('/graphql createDb (db name already exists)', async () => {
            // create initial db
            await dbmss.environment.dbmss.dbCreate(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation CreateDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                createDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Database already exist');
                });
        });

        test('/graphql createDb', async () => {
            // delete db if it exists
            await dbmss.environment.dbmss.dbDrop(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation CreateDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                createDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {createDb} = res.body.data;
                    expect(createDb).toBe(TEST_DB_NAME);
                });
        });

        test('/graphql dropDb (invalid accessToken)', () => {
            const accessToken = 'invalidAccessToken1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation DropDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                dropDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Unable to connect to DBMS');
                });
        });

        test('/graphql dropDb (db not initially created)', async () => {
            // delete db if it exists
            await dbmss.environment.dbmss.dbDrop(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation DropDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                dropDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Database does not exist');
                });
        });

        test('/graphql dropDb', async () => {
            // create initial db
            await dbmss.environment.dbmss.dbCreate(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation DropDb($dbmsId: String!, $user: String!, $dbName: String!, $accessToken: String!) {
                                dropDb(dbmsId: $dbmsId, user: $user, dbName: $dbName, accessToken: $accessToken)
                            }`,
                        {
                            user: 'neo4j',
                            dbName: TEST_DB_NAME,
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {dropDb} = res.body.data;
                    expect(dropDb).toBe(TEST_DB_NAME);
                });
        });

        test('/graphql listDbs (invalid accessToken)', () => {
            const accessToken = 'invalidAccessToken1234';

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDbs($dbmsId: String!, $user: String!, $accessToken: String!) {
                            listDbs(dbmsId: $dbmsId, user: $user, accessToken: $accessToken) {
                                name,
                                role,
                                requestedStatus,
                                currentStatus,
                                error,
                                default
                            }
                        }`,
                        {
                            user: 'neo4j',
                            dbmsId: TEST_DBMS_NAME,
                            accessToken,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {errors} = res.body;
                    expect(errors).toHaveLength(1);
                    expect(errors[0].message).toContain('Unable to connect to DBMS');
                });
        });

        test('/graphql listDbs (db not initially created)', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDbs($dbmsId: String!, $user: String!, $accessToken: String!) {
                                listDbs(dbmsId: $dbmsId, user: $user, accessToken: $accessToken) {
                                    name,
                                    role,
                                    requestedStatus,
                                    currentStatus,
                                    error,
                                    default
                                }
                            }`,
                        {
                            user: 'neo4j',
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {listDbs} = res.body.data;
                    // expect 'neo4j' and 'system' dbs at least at this stage
                    expect(listDbs).toHaveLength(2);
                    expect(listDbs).toEqual([
                        {
                            currentStatus: 'online',
                            default: 'true',
                            error: '',
                            name: 'neo4j',
                            requestedStatus: 'online',
                            role: 'standalone',
                        },
                        {
                            currentStatus: 'online',
                            default: 'false',
                            error: '',
                            name: 'system',
                            requestedStatus: 'online',
                            role: 'standalone',
                        },
                    ]);
                });
        });

        test('/graphql listDbs (db created)', async () => {
            // create initial db
            await dbmss.environment.dbmss.dbCreate(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `query ListDbs($dbmsId: String!, $user: String!, $accessToken: String!) {
                                listDbs(dbmsId: $dbmsId, user: $user, accessToken: $accessToken) {
                                    name,
                                    role,
                                    requestedStatus,
                                    currentStatus,
                                    error,
                                    default
                                }
                            }`,
                        {
                            user: 'neo4j',
                            dbmsId: TEST_DBMS_NAME,
                            accessToken: TEST_DBMS_ACCESS_TOKEN,
                        },
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {listDbs} = res.body.data;
                    expect(listDbs).toHaveLength(3);
                    expect(listDbs).toEqual([
                        {
                            currentStatus: 'online',
                            default: 'true',
                            error: '',
                            name: 'neo4j',
                            requestedStatus: 'online',
                            role: 'standalone',
                        },
                        {
                            currentStatus: 'online',
                            default: 'false',
                            error: '',
                            name: 'system',
                            requestedStatus: 'online',
                            role: 'standalone',
                        },
                        {
                            currentStatus: 'online',
                            default: 'false',
                            error: '',
                            name: 'testdb',
                            requestedStatus: 'online',
                            role: 'standalone',
                        },
                    ]);
                });
        });

        test('/graphql stopDbmss', () => {
            return request(app.getHttpServer())
                .post('/graphql')
                .send(
                    queryBody(
                        `mutation StopDBMSSs($environmentNameOrId: String, $dbmsNames: [String!]!) {
                            stopDbmss(environmentNameOrId: $environmentNameOrId, dbmsIds: $dbmsNames)
                        }`,
                    ),
                )
                .expect(HTTP_OK)
                .expect((res: request.Response) => {
                    const {stopDbmss} = res.body.data;

                    if (process.platform === 'win32') {
                        expect(stopDbmss[0]).toContain('Neo4j service stopped');
                    } else {
                        expect(stopDbmss[0]).toContain('Stopping Neo4j');
                        expect(stopDbmss[0]).toContain('stopped');
                    }
                });
        });
    });
});
