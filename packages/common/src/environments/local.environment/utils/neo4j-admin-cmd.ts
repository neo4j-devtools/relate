import fs from 'fs-extra';
import path from 'path';
import {spawn} from 'child_process';

import {NotFoundError} from '../../../errors';
import {NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE} from '../../environment.constants';

export function neo4jAdminCmd(dbmsRootPath: string, command: string, credentials?: string): Promise<string> {
    const neo4jAdminBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE);

    return new Promise((resolve, reject) => {
        fs.access(neo4jAdminBinPath, fs.constants.X_OK, (err: NodeJS.ErrnoException | null) => {
            if (err) {
                reject(new NotFoundError(`No DBMS found at "${dbmsRootPath}"`));
                return;
            }
            const data: string[] = [];
            const collect = (chunk: Buffer): void => {
                data.push(chunk.toString());
            };

            const args = [command === 'help' || command === 'version' ? `--${command}` : command];
            if (credentials) {
                args.push(process.platform === 'win32' ? `"${credentials}"` : credentials);
            }

            const neo4jAdminCommand = spawn(neo4jAdminBinPath, args);
            neo4jAdminCommand.stderr.on('data', collect);
            neo4jAdminCommand.stderr.on('error', reject);
            neo4jAdminCommand.stderr.on('close', () => resolve(data.join('')));
            neo4jAdminCommand.stderr.on('end', () => resolve(data.join('')));

            neo4jAdminCommand.stdout.on('data', collect);
            neo4jAdminCommand.stdout.on('error', reject);
            neo4jAdminCommand.stdout.on('close', () => resolve(data.join('')));
            neo4jAdminCommand.stdout.on('end', () => resolve(data.join('')));
        });
    });
}
