import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import {ConfigModule} from '@nestjs/config';
import request from 'supertest';
import {TestDbmss, IDbms, DBMS_STATUS} from '@relate/common';

import configuration from '../configs/dev.config';
import {WebModule} from '../web.module';

let TEST_DB_NAME: string;
const TEST_APP_ID = 'foo';

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const HTTP_OK = 200;

const queryBody = (query: string, variables?: {[key: string]: any}): {[key: string]: any} => ({
    query,
    variables: {
        dbmsName: TEST_DB_NAME,
        dbmsNames: [TEST_DB_NAME],
        environmentId: 'test',
        ...variables,
    },
});

describe('DBMSModule', () => {
    let app: INestApplication;
    let dbmss: TestDbmss;

    beforeAll(async () => {
        dbmss = await TestDbmss.init(__filename);
        const {name} = await dbmss.createDbms();

        TEST_DB_NAME = name;

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

    test('/graphql listDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query ListDBMSSs($environmentId: String!) {
                        listDbmss(environmentId: $environmentId) {
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
                expect(listDbmss.map(({name}: IDbms) => name)).toContain(TEST_DB_NAME);
            });
    });

    test('/graphql startDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation StartDBMSSs($environmentId: String!, $dbmsNames: [String!]!) {
                        startDbmss(environmentId: $environmentId, dbmsIds: $dbmsNames)
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

    test('/graphql infoDbmss (started DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query InfoDBMSs($environmentId: String!, $dbmsNames: [String!]!) {
                        infoDbmss(environmentId: $environmentId, dbmsIds: $dbmsNames) {
                            name
                            status
                        }
                    }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {infoDbmss} = res.body.data;
                expect(infoDbmss[0].name).toEqual(TEST_DB_NAME);
                expect(infoDbmss[0].status).toEqual(DBMS_STATUS.STARTED);
            });
    });

    test('/graphql accessDbms (started DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation AccessDBMS(
                        $environmentId: String!,
                        $dbmsName: String!,
                        $authToken: AuthTokenInput!,
                        $appName: String!
                    ) {
                        createAccessToken(
                            environmentId: $environmentId,
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

    test('/graphql stopDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation StopDBMSSs($environmentId: String!, $dbmsNames: [String!]!) {
                        stopDbmss(environmentId: $environmentId, dbmsIds: $dbmsNames)
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

    test('/graphql infoDbmss (stopped DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query InfoDBMSSs($environmentId: String!, $dbmsNames: [String!]!) {
                        infoDbmss(environmentId: $environmentId, dbmsIds: $dbmsNames) {
                            name
                            status
                        }
                    }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {infoDbmss} = res.body.data;
                expect(infoDbmss[0].name).toEqual(TEST_DB_NAME);
                expect(infoDbmss[0].status).toEqual(DBMS_STATUS.STOPPED);
            });
    });

    test('/graphql infoDbmss (non existent environment)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query InfoDBMSs {
                        infoDbmss(environmentId: "non-existent", dbmsIds: ["test"]) {
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
                    `query InfoDBMSs($environmentId: String!) {
                        infoDbmss(environmentId: $environmentId, dbmsIds: ["non-existent"]) {
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
});
