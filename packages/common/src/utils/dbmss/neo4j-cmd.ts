import fse from 'fs-extra';
import path from 'path';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_BIN_FILE} from '../../entities/environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';
import {EnvVars} from '../env-vars';
import {getDistributionVersion} from './dbms-versions';

export async function neo4jCmd(dbmsRootPath: string, command: string): Promise<string> {
    const neo4jBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_BIN_FILE);
    const {version: dbmsVersion} = await getDistributionVersion(dbmsRootPath);
    const relateJavaHome = await resolveRelateJavaHome(dbmsVersion);

    await fse.access(neo4jBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    env.set('NEO4J_ACCEPT_LICENSE_AGREEMENT', 'yes');
    // relateJavaHome is prepended to the PATH in order to take
    // precedence over any user installed JAVA executable.
    env.set('PATH', relateJavaHome ? `${relateJavaHome}${path.delimiter}${process.env.PATH}` : process.env.PATH);

    const output = await spawnPromise(neo4jBinPath, [command], {
        env: env.toObject(),
    });

    if (output.includes('ERROR: Unable to find Java executable.')) {
        throw new DependencyError('Unable to find Java executable');
    }

    if (output.includes('Neo4j cannot be started using java version')) {
        throw new DependencyError(output);
    }

    return output;
}
