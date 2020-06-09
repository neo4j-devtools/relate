import path from 'path';
import {Worker} from 'worker_threads';

export const oAuthRedirectServer = (workerData: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        const worker = new Worker(path.join(__dirname, 'oauth-redirect-server.js'), {
            workerData,
        });

        worker.on('message', (data) => resolve(data));
        worker.on('error', reject);
        worker.on('exit', (exitCode) => {
            if (exitCode !== 0) {
                reject(new Error(`Worker stopped with exit code ${exitCode}`));
            }
        });
    });
};
