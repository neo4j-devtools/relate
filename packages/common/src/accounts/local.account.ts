import envPaths from 'env-paths';
import path from 'path';
import {access, constants} from 'fs';
import {spawn} from 'child_process';

import {AccountAbstract} from './account.abstract';

export class LocalAccount extends AccountAbstract {
    private neo4j(dbmsID: string, command: string): Promise<string> {
        const {data: dataPath} = envPaths('daedalus', {suffix: ''});
        const neo4jPath = path.join(dataPath, 'neo4jDBMS', dbmsID, 'bin', 'neo4j');

        return new Promise((resolve, reject) => {
            access(neo4jPath, constants.X_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject(err);
                    return;
                }

                const data: string[] = [];
                const collect = (chunk: Buffer) => {
                    data.push(chunk.toString());
                };

                const neo4jCommand = spawn(neo4jPath, [command]);
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

    startDBMS(uuid: string): Promise<string> {
        return this.neo4j(uuid, 'start');
    }

    stopDBMS(uuid: string): Promise<string> {
        return this.neo4j(uuid, 'stop');
    }

    statusDBMS(uuid: string): Promise<string> {
        return this.neo4j(uuid, 'status');
    }
}
