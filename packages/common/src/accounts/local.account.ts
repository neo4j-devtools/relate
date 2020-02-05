import envPaths from 'env-paths';
import path from 'path';
import {access, constants} from 'fs';
import {spawn} from 'child_process';

import {AccountAbstract} from './account.abstract';

export class LocalAccount extends AccountAbstract {
    private neo4j(dbmsID: string, command: string): Promise<boolean> {
        const {data: dataPath} = envPaths('daedalus', {suffix: ''});
        const neo4jPath = path.join(dataPath, 'neo4jDBMS', dbmsID, 'bin', 'neo4j');

        return new Promise<boolean>((resolve, reject) => {
            access(neo4jPath, constants.X_OK, (err: NodeJS.ErrnoException | null) => {
                if (err) {
                    reject(err);
                    return;
                }

                const neo4jCommand = spawn(neo4jPath, [command]);
                function log(data: Buffer): void {
                    // eslint-disable-next-line no-console
                    console.log(data.toString());
                }
                neo4jCommand.stderr.on('data', log);
                neo4jCommand.stderr.on('error', reject);
                neo4jCommand.stderr.on('close', () => resolve(true));
                neo4jCommand.stderr.on('end', () => resolve(true));

                neo4jCommand.stdout.on('data', log);
                neo4jCommand.stdout.on('error', reject);
                neo4jCommand.stdout.on('close', () => resolve(true));
                neo4jCommand.stdout.on('end', () => resolve(true));
            });
        });
    }

    startDBMS(uuid: string): Promise<boolean> {
        return this.neo4j(uuid, 'start');
    }

    stopDBMS(uuid: string): Promise<boolean> {
        return this.neo4j(uuid, 'stop');
    }

    statusDBMS(uuid: string): Promise<boolean> {
        return this.neo4j(uuid, 'status');
    }
}
