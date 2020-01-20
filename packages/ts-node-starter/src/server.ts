import express from 'express';

const server = express();
const SUCCESS = 200;

server.get('/foo', (_, res) => res.sendStatus(SUCCESS));

export default server;
