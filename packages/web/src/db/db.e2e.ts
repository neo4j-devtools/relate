import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {ConfigModule} from '@nestjs/config';
import request from 'supertest';
import {TestDbmss} from '@relate/common';

import configuration from '../configs/dev.config';
import {WebModule} from '../web.module';
let TEST_DBMS_NAME: string;
const TEST_APP_ID = 'foo';
const TEST_DB_NAME = 'testDb';

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

describe('DBMSModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;
    let TEST_DBMS_ACCESS_TOKEN: string;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {name} = await dbmss.createDbms();
        TEST_DBMS_NAME = name;

        await dbmss.environment.dbmss.start([TEST_DBMS_NAME]);

        // set access token
        TEST_DBMS_ACCESS_TOKEN = await dbmss.environment.dbmss.createAccessToken(TEST_APP_ID, TEST_DBMS_NAME, {
            credentials: TestDbmss.DBMS_CREDENTIALS,
            principal: 'neo4j',
            scheme: 'basic',
        });

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

    describe('databases', () => {
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
            await dbmss.environment.dbs.create(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

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
            await dbmss.environment.dbs.drop(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

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
            await dbmss.environment.dbs.drop(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

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
            await dbmss.environment.dbs.create(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

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
            await dbmss.environment.dbs.create(TEST_DBMS_NAME, 'neo4j', TEST_DB_NAME, TEST_DBMS_ACCESS_TOKEN);

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
