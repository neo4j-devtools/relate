import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {TestDbmss, IDbms} from '@relate/common';

import {WebModule} from '../web.module';

let TEST_DB_NAME: string;
const TEST_APP_ID = 'foo';

const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const HTTP_OK = 200;

const queryBody = (query: string, variables?: {[key: string]: any}) => ({
    query,
    variables: {
        accountId: 'test',
        dbmsNames: [TEST_DB_NAME],
        dbmsName: TEST_DB_NAME,
        ...variables,
    },
});

describe('DBMSModule', () => {
    let app: INestApplication;
    const dbmss: TestDbmss = new TestDbmss(__filename);

    beforeAll(async () => {
        TEST_DB_NAME = await dbmss.createDbms();

        const module = await Test.createTestingModule({
            imports: [WebModule],
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
                    `query ListDBMSSs($accountId: String!) {
                        listDbmss(accountId: $accountId) {
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
                    `mutation StartDBMSSs($accountId: String!, $dbmsNames: [String!]!) {
                        startDbmss(accountId: $accountId, dbmsIds: $dbmsNames)
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

    test('/graphql statusDbmss (started DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query StatusDBMSSs($accountId: String!, $dbmsNames: [String!]!) {
                        statusDbmss(accountId: $accountId, dbmsIds: $dbmsNames)
                    }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {statusDbmss} = res.body.data;
                expect(statusDbmss[0]).toContain('Neo4j is running');
            });
    });

    test('/graphql accessDbms (started DBMS)', async () => {
        // arbitrary wait for Neo4j to come online
        await new Promise((resolve) => setTimeout(resolve, 20000));

        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `mutation AccessDBMS(
                        $accountId: String!,
                        $dbmsName: String!,
                        $authToken: AuthTokenInput!,
                        $appId: String!
                    ) {
                        createAccessToken(
                            accountId: $accountId,
                            dbmsId: $dbmsName,
                            appId: $appId,
                            authToken: $authToken
                        )
                    }`,
                    {
                        appId: TEST_APP_ID,
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
                    `mutation StopDBMSSs($accountId: String!, $dbmsNames: [String!]!) {
                        stopDbmss(accountId: $accountId, dbmsIds: $dbmsNames)
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

    test('/graphql statusDbmss (stopped DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query StatusDBMSSs($accountId: String!, $dbmsNames: [String!]!) {
                        statusDbmss(accountId: $accountId, dbmsIds: $dbmsNames)
                    }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {statusDbmss} = res.body.data;
                expect(statusDbmss[0]).toContain('Neo4j is not running');
            });
    });

    test('/graphql statusDbmss (non existent account)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query StatusDBMSs {
                        statusDbmss(accountId: "non-existent", dbmsIds: ["test"])
                    }`,
                ),
            )
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {errors} = res.body;
                expect(errors).toHaveLength(1);
                expect(errors[0].message).toBe('Account "non-existent" not found');
            });
    });

    test('/graphql statusDbmss (non existent DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(
                queryBody(
                    `query StatusDBMSs($accountId: String!) {
                        statusDbmss(accountId: $accountId, dbmsIds: ["non-existent"])
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
