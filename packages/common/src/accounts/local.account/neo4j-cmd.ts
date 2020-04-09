import fs from 'fs-extra';
import path from 'path';
import {exec, spawn} from 'child_process';

import {NotFoundError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_BIN_FILE} from '../account.constants';

export function neo4jCmd(dbmsRootPath: string, command: string): Promise<string> {
    const neo4jBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_BIN_FILE);

    return new Promise((resolve, reject) => {
        fs.access(neo4jBinPath, fs.constants.X_OK, (err: NodeJS.ErrnoException | null) => {
            if (err) {
                reject(new NotFoundError(`No DBMS found at "${dbmsRootPath}"`));
                return;
            }
            const data: string[] = [];
            const collect = (chunk: Buffer): void => {
                data.push(chunk.toString());
            };

            const neo4jCommand = spawn(neo4jBinPath, [command]);
            neo4jCommand.stderr.on('data', collect);
            neo4jCommand.stderr.on('error', reject);
            neo4jCommand.stderr.on('close', () => resolve(data.join('')));
            neo4jCommand.stderr.on('end', () => resolve(data.join('')));

            neo4jCommand.stdout.on('data', collect);
            neo4jCommand.stdout.on('error', reject);
            neo4jCommand.stdout.on('close', () => resolve(data.join('')));
            neo4jCommand.stdout.on('end', () => resolve(data.join('')));
        });
    });
}

export function elevatedNeo4jCmd(dbmsRootPath: string, command: string): Promise<string> {
    const neo4jBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_BIN_FILE);

    return new Promise((resolve, reject) => {
        fs.access(neo4jBinPath, fs.constants.X_OK, (err: NodeJS.ErrnoException | null) => {
            if (err) {
                reject(new NotFoundError(`No DBMS found at "${dbmsRootPath}"`));
                return;
            }

            /* eslint-disable max-len */
            const elevatedCmd =
                process.platform === 'win32'
                    ? `Start-Process PowerShell -Verb RunAs "-Command \`"cd '$pwd'; & '${neo4jBinPath}' ${command};\`"" -PassThru -Wait`
                    : `sudo ${neo4jBinPath} ${command}`;
            /* eslint-enable max-len */
            const execOptions = process.platform === 'win32' ? {shell: 'powershell'} : {};

            exec(elevatedCmd, execOptions, (err2, stdout, stderr) => {
                if (err2) {
                    reject(err2.message);
                    return;
                }

                if (stderr) {
                    reject(stderr);
                    return;
                }

                resolve(stdout);
            });
        });
    });
}
