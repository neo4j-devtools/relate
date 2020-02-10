import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';

import {WebModule} from '../web.module';

const DBMS_STATUS = {
    query: 'query StatusDBMSs { statusDbmss(accountId: "foo", dbmsIds: ["test"]) }',
    variables: {},
};
const DBMS_START = {
    query: 'mutation StartDBMSs { startDbmss(accountId: "foo", dbmsIds: ["test"]) }',
    variables: {},
};
const DBMS_STOP = {
    query: 'mutation StopDBMSs { stopDbmss(accountId: "foo", dbmsIds: ["test"]) }',
    variables: {},
};
const HTTP_OK = 200;

describe('DBMSModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [WebModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    test('/graphql startDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_START)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {startDbmss} = res.body.data;
                expect(startDbmss[0]).toContain('Directories in use');
                expect(startDbmss[0]).toContain('Starting Neo4j');
                expect(startDbmss[0]).toContain('Started neo4j (pid');
            });
    });

    test('/graphql statusDbmss (started DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STATUS)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {statusDbmss} = res.body.data;
                expect(statusDbmss[0]).toContain('Neo4j is running at pid');
            });
    });

    test('/graphql stopDbmss', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STOP)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {stopDbmss} = res.body.data;
                expect(stopDbmss[0]).toContain('Stopping Neo4j');
                expect(stopDbmss[0]).toContain('stopped');
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

    afterAll(async () => {
        await app.close();
    });
});
