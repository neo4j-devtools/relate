import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';

import {ElectronModule} from './electron.module';

const HTTP_OK = 200;
const GET_ELECTRON_HELLO = {
    operationName: 'Foo',
    query: 'query Foo {getElectronHello}',
    variables: {},
};

describe('WebModule', () => {
    let testApp: INestApplication;

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [ElectronModule],
        }).compile();
        testApp = module.createNestApplication();

        await testApp.init();
    });

    test(`/graphql getElectronHello`, () => {
        return request(testApp.getHttpServer())
            .post('/graphql')
            .send(GET_ELECTRON_HELLO)
            .expect(HTTP_OK)
            .expect({
                data: {getElectronHello: 'Hello electron'},
            });
    });

    afterAll(async () => {
        await testApp.close();
    });
});
