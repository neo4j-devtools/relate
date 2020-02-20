import {access, constants} from 'fs';
import {spawn} from 'child_process';
import path from 'path';

import {AccountAbstract} from './account.abstract';
import {NotFoundError} from '../errors';

export class LocalAccount extends AccountAbstract {
    private neo4j(dbmsID: string, command: string): Promise<string> {
        const neo4jPath = path.join(this.config.neo4jDataPath, 'dbmss', dbmsID, 'bin', 'neo4j');
        return new Promise((resolve, reject) => {
            access(neo4jPath, constants.X_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject(new NotFoundError(`DBMS "${dbmsID}" not found`));
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

    startDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'start')));
    }

    stopDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'stop')));
    }

    statusDbmss(dbmsIds: string[]): Promise<string[]> {
        return Promise.all(dbmsIds.map((id) => this.neo4j(id, 'status')));
    }
}
