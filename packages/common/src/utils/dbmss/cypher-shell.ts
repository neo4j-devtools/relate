import fse from 'fs-extra';
import path from 'path';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, CYPHER_SHELL_BIN_FILE} from '../../entities/environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';
import {EnvVars} from '../env-vars';

export async function cypherShellCmd(
    dbmsRootPath: string,
    args: string[],
    from: string,
    credentials?: string,
): Promise<string> {
    const cypherShellBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, CYPHER_SHELL_BIN_FILE);
    const relateJavaHome = await resolveRelateJavaHome();

    const file = path.resolve(from);
    try {
        await fse.ensureFile(file);
    } catch (e) {
        throw new NotFoundError(`File not found (${file})`);
    }

    await fse.access(cypherShellBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    if (args[0] === 'help' || args[0] === 'version') {
        args[0] = `--${args[0]}`;
    }

    if (credentials) {
        args.push(process.platform === 'win32' ? `--password="${credentials}"` : `--password=${credentials}`);
    }

    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    // relateJavaHome is prepended to the PATH in order to take
    // precedence over any user installed JAVA executable.
    env.set('PATH', relateJavaHome ? `${relateJavaHome}${path.delimiter}${process.env.PATH}` : process.env.PATH);

    const stream = fse.createReadStream(file);
    const output = await spawnPromise(
        cypherShellBinPath,
        args,
        {
            env: env.toObject(),
        },
        stream,
    );

    if (output.includes('ERROR: Unable to find Java executable.')) {
        throw new DependencyError('Unable to find Java executable');
    }

    return output;
}
