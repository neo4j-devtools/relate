import http from 'http';
import url from 'url';
import {workerData, parentPort} from 'worker_threads';

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
    const queryObject = url.parse(req.url || '', true).query;

    if (parentPort && parentPort.postMessage) {
        parentPort.postMessage(queryObject.code);
    }

    // TODO: check error field

    res.writeHead(200);
    res.end();

    process.exit();
};

const server = http.createServer(requestListener);
server.listen({
    host: workerData.host,
    port: workerData.port,
});
