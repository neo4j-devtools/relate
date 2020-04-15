/* eslint-disable max-len */

import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {SystemProvider} from '@relate/common';

import {ElectronModule} from './electron.module';

jest.setTimeout(30000);

const TEST_ACCOUNT_ID = 'test';
const TEST_APP_ID = 'foo';
const TEST_DB_NAME = 'test-db';
const TEST_DB_CREDENTIALS = 'newpassword';
const TEST_DB_VERSION = '4.0.4';

const DBMS_LIST = {
    query: 'query ListDBMSs($accountId: String!) { listDbmss(accountId: $accountId) { id, name, description } }',
    variables: {accountId: TEST_ACCOUNT_ID},
};
const DBMS_STATUS = {
    query:
        'query StatusDBMSs($accountId: String!, $dbName: [String!]!) { statusDbmss(accountId: $accountId, dbmsIds: $dbName) }',
    variables: {
        accountId: TEST_ACCOUNT_ID,
        dbName: [TEST_DB_NAME],
    },
};
const DBMS_START = {
    query:
        'mutation StartDBMSs($accountId: String!, $dbName: [String!]!) { startDbmss(accountId: $accountId, dbmsIds: $dbName) }',
    variables: {
        accountId: TEST_ACCOUNT_ID,
        dbName: [TEST_DB_NAME],
    },
};
const DBMS_STOP = {
    query:
        'mutation StopDBMSs($accountId: String!, $dbName: [String!]!) { stopDbmss(accountId: $accountId, dbmsIds: $dbName) }',
    variables: {
        accountId: TEST_ACCOUNT_ID,
        dbName: [TEST_DB_NAME],
    },
};
const DBMS_ACCESS = {
    query: `mutation AccessDBMS($accountId: String!, $dbName: String!, $authToken: AuthTokenInput!) {
        createAccessToken(accountId: $accountId, dbmsId: $dbName, appId: "foo", authToken: $authToken)
    }`,
    variables: {
        accountId: TEST_ACCOUNT_ID,
        appId: TEST_APP_ID,
        authToken: {
            credentials: 'newpassword',
            principal: 'neo4j',
            scheme: 'basic',
        },
        dbName: TEST_DB_NAME,
    },
};
const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;
const HTTP_OK = 200;

describe('DBMSModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [ElectronModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
        const systemProvider = app.get(SystemProvider);

        await systemProvider
            .getAccount(TEST_ACCOUNT_ID)
            .installDbms(TEST_DB_NAME, TEST_DB_CREDENTIALS, TEST_DB_VERSION);
    });

    afterAll(async () => {
        const systemProvider = app.get(SystemProvider);

        await systemProvider.getAccount(TEST_ACCOUNT_ID).uninstallDbms(TEST_DB_NAME);
        await app.close();
    });

    test('/graphql listDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_LIST)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {listDbmss} = res.body.data;
                expect(listDbmss[0].name).toBe(TEST_DB_NAME);
                expect(listDbmss.length).toBe(1);
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

    test.skip('/graphql accessDbms (started DBMS)', async () => {
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
                query:
                    'query StatusDBMSs($accountId: String!) { statusDbmss(accountId: $accountId, dbmsIds: ["non-existent"]) }',
                variables: {accountId: TEST_ACCOUNT_ID},
            })
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {errors} = res.body;
                expect(errors).toHaveLength(1);
                expect(errors[0].message).toBe('DBMS "non-existent" not found');
            });
    });
});
