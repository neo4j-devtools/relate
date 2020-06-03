import fse from 'fs-extra';
import path from 'path';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE} from '../../environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';

export async function neo4jAdminCmd(dbmsRootPath: string, command: string, credentials?: string): Promise<string> {
    const neo4jAdminBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE);
    const relateJavaHome = await resolveRelateJavaHome();

    await fse.access(neo4jAdminBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    const args = [command === 'help' || command === 'version' ? `--${command}` : command];
    if (credentials) {
        args.push(process.platform === 'win32' ? `"${credentials}"` : credentials);
    }

    const output = await spawnPromise(neo4jAdminBinPath, args, {
        env: {
            ...process.env,
            JAVA_HOME: relateJavaHome || process.env.JAVA_HOME,
            // relateJavaHome is prepended to the PATH in order to take
            // precedence over any user installed JAVA executable.
            PATH: `${relateJavaHome || ''}${path.delimiter}${process.env.PATH}`,
        },
    });

    if (output.includes('ERROR: Unable to find Java executable.')) {
        throw new DependencyError('Unable to find Java executable');
    }

    return output;
}
