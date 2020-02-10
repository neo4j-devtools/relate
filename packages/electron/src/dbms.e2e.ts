import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';

import {ElectronModule} from './electron.module';

const DBMS_STATUS = {
    query: 'query StatusDBMS { statusDbms(accountID: "foo", dbmsID: "test") }',
    variables: {},
};
const HTTP_OK = 200;

describe('DBMSModule', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [ElectronModule],
        }).compile();

        app = module.createNestApplication();
        await app.init();
    });

    test('/graphql startDbms', () => {
        const DBMS_START = {
            query: 'mutation StartDBMS { startDbms(accountID: "foo", dbmsID: "test") }',
            variables: {},
        };
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_START)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {data} = res.body;
                expect(data.startDbms).toContain('Directories in use');
                expect(data.startDbms).toContain('Starting Neo4j');
                expect(data.startDbms).toContain('Started neo4j (pid');
            });
    });

    test('/graphql statusDbms (started DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STATUS)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {data} = res.body;
                expect(data.statusDbms).toContain('Neo4j is running at pid');
            });
    });

    test('/graphql stopDbms', () => {
        const DBMS_STOP = {
            query: 'mutation StopDBMS { stopDbms(accountID: "foo", dbmsID: "test") }',
            variables: {},
        };
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STOP)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {data} = res.body;
                expect(data.stopDbms).toContain('Stopping Neo4j');
                expect(data.stopDbms).toContain('stopped');
            });
    });

    test('/graphql statusDbms (stopped DBMS)', () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(DBMS_STATUS)
            .expect(HTTP_OK)
            .expect((res: request.Response) => {
                const {data} = res.body;
                expect(data.statusDbms).toContain('Neo4j is not running');
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
