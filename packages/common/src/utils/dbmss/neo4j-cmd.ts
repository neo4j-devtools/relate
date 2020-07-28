import fse from 'fs-extra';
import path from 'path';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_BIN_FILE} from '../../entities/environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';
import {EnvVars} from '../env-vars';

export async function neo4jCmd(dbmsRootPath: string, command: string): Promise<string> {
    const neo4jBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_BIN_FILE);
    const relateJavaHome = await resolveRelateJavaHome();

    await fse.access(neo4jBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    // relateJavaHome is prepended to the PATH in order to take
    // precedence over any user installed JAVA executable.
    env.set('PATH', relateJavaHome ? `${relateJavaHome}${path.delimiter}${process.env.PATH}` : process.env.PATH);

    const output = await spawnPromise(neo4jBinPath, [command], {
        env: env.toObject(),
    });

    if (output.includes('ERROR: Unable to find Java executable.')) {
        throw new DependencyError('Unable to find Java executable');
    }

    return output;
}
