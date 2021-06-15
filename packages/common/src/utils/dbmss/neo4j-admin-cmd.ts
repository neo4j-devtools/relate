import fse from 'fs-extra';
import path from 'path';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE} from '../../entities/environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';
import {EnvVars} from '../env-vars';
import {getDistributionVersion} from './dbms-versions';

export async function neo4jAdminCmd(
    dbmsRootPath: string,
    args: string[],
    credentials?: string,
    javaPath?: string,
): Promise<string> {
    const neo4jAdminBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_ADMIN_BIN_FILE);
    const {version: dbmsVersion} = await getDistributionVersion(dbmsRootPath);
    const relateJavaHome = javaPath || (await resolveRelateJavaHome(dbmsVersion));

    await fse.access(neo4jAdminBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    if (args[0] === 'help' || args[0] === 'version') {
        args[0] = `--${args[0]}`;
    }
    if (credentials) {
        args.push(process.platform === 'win32' ? `"${credentials}"` : credentials);
    }

    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    // relateJavaHome is prepended to the PATH in order to take
    // precedence over any user installed JAVA executable.
    env.set('PATH', relateJavaHome ? `${relateJavaHome}${path.delimiter}${process.env.PATH}` : process.env.PATH);

    const output = await spawnPromise(neo4jAdminBinPath, args, {
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
