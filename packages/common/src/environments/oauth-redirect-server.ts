import http from 'http';
import {workerData, parentPort, isMainThread} from 'worker_threads';

import {NotSupportedError, AuthenticationError} from '../errors';
import {AUTH_TOKEN_KEY} from '../constants';

if (isMainThread) {
    throw new NotSupportedError('OAuth redirect server must run in a worker thread');
}

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse): void => {
    const authToken = req.headers[AUTH_TOKEN_KEY];

    if (!authToken) {
        throw new AuthenticationError('Failed to authenticate');
    }

    if (parentPort && parentPort.postMessage) {
        parentPort.postMessage(authToken);
    }

    res.writeHead(200);
    res.write('You are authenticated, you can close this tab now.', () => {
        res.end(() => process.exit());
    });
};

const server = http.createServer(requestListener);
server.listen({
    host: workerData.host,
    port: workerData.port,
});
