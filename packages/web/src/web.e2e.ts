import {INestApplication} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import request from 'supertest';
import {HelloService} from '@daedalus/common';

import {WebModule} from './web.module';

const HTTP_OK = 200;
const GET_HELLO = {
    operationName: 'Foo',
    query: 'query Foo {getHello}',
    variables: {},
};
const GET_GOODBYE = {
    operationName: 'Foo',
    query: 'query Foo {getGoodbye}',
    variables: {},
};

describe('WebModule', () => {
    let app: INestApplication;
    const helloService = {
        getGoodbye: (): string => 'bye!',
        getHello: (): string => 'hi!',
    };

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            imports: [WebModule],
        })
            .overrideProvider(HelloService)
            .useValue(helloService)
            .compile();

        app = module.createNestApplication();
        await app.init();
    });

    test(`/graphql getHello`, () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(GET_HELLO)
            .expect(HTTP_OK)
            .expect({
                data: {getHello: helloService.getHello()},
            });
    });

    test(`/graphql getGoodbye`, () => {
        return request(app.getHttpServer())
            .post('/graphql')
            .send(GET_GOODBYE)
            .expect(HTTP_OK)
            .expect({
                data: {getGoodbye: helloService.getGoodbye()},
            });
    });

    afterAll(async () => {
        await app.close();
    });
});
