import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';

import {WebModule} from '../web.module';

jest.setTimeout(30000);

const DBMS_LIST = {
    query: 'query ListDBMSs { listDbmss(accountId: "test") { id, name, description } }',
    variables: {},
};
const DBMS_STATUS = {
    query: 'query StatusDBMSs { statusDbmss(accountId: "test", dbmsIds: ["test"]) }',
    variables: {},
};
const DBMS_START = {
    query: 'mutation StartDBMSs { startDbmss(accountId: "test", dbmsIds: ["test"]) }',
    variables: {},
};
const DBMS_STOP = {
    query: 'mutation StopDBMSs { stopDbmss(accountId: "test", dbmsIds: ["test"]) }',
    variables: {},
};
const DBMS_ACCESS = {
    query: `mutation AccessDBMS($authToken: AuthTokenInput!) {
        createAccessToken(accountId: "test", dbmsId: "test", appId: "foo", authToken: $authToken)
    }`,
    variables: {
        authToken: {
            credentials: 'newpassword',
            principal: 'neo4j',
            scheme: 'basic',
        },
    },
};
const HTTP_OK = 200;
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

describe('DBMSModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [WebModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    test('/graphql listDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_LIST)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {listDbmss} = res.body.data;
                expect(listDbmss).toEqual([
                    {
                        description: 'Dummy DBMS used for e2e tests.',
                        id: 'test',
                        name: 'Test',
                    },
                ]);
            });
    });

    test('/graphql startDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_START)
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
            .send(DBMS_STATUS)
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
            .send(DBMS_ACCESS)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {createAccessToken} = res.body.data;
                expect(createAccessToken).toEqual(expect.stringMatching(JWT_REGEX));
            });
    });

    test('/graphql stopDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STOP)
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
            .send(DBMS_STATUS)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {statusDbmss} = res.body.data;
                expect(statusDbmss[0]).toContain('Neo4j is not running');
            });
    });

    test('/graphql statusDbmss (non existent account)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send({
                query: 'query StatusDBMSs { statusDbmss(accountId: "non-existent", dbmsIds: ["test"]) }',
            })
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
            .send({
                query: 'query StatusDBMSs { statusDbmss(accountId: "test", dbmsIds: ["non-existent"]) }',
            })
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {errors} = res.body;
                expect(errors).toHaveLength(1);
                expect(errors[0].message).toBe('DBMS "non-existent" not found');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
