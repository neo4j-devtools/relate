import http from 'http';
import url from 'url';
import {workerData, parentPort, isMainThread} from 'worker_threads';
import {NotSupportedError, AuthenticationError} from '../errors';

if (isMainThread) {
    throw new NotSupportedError('OAuth redirect server must run in a worker thread');
}

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const queryObject = url.parse(req.url || '', true).query;

    if (queryObject.error) {
        throw new AuthenticationError(`Login failed: ${queryObject.error}`);
    }

    if (parentPort && parentPort.postMessage) {
        parentPort.postMessage(queryObject.code);
    }

    res.writeHead(200);
    res.write('You are authenticated, you can close this tab now.');
    res.end();

    process.exit();
};

const server = http.createServer(requestListener);
server.listen({
    host: workerData.host,
    port: workerData.port,
});
