import request from 'supertest';

import server from './server';

const SUCCESS = 200;
const NOT_FOUND = 404;

describe('Server test', () => {
    describe('Successful requests', () => {
        test('Gets 200 OK response', async () => {
            const res = await request(server).get(`/foo`);

            expect(res.status).toBe(SUCCESS);
        });
    });

    describe('Failed requests', () => {
        test('Gets 404 Not found response', async () => {
            const res = await request(server).get(`/bar`);

            expect(res.status).toBe(NOT_FOUND);
        });
    });
});
