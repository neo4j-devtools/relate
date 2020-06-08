import {exec} from 'child_process';
import fse from 'fs-extra';
import path from 'path';

import {NotAllowedError, NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, NEO4J_BIN_FILE} from '../../environments/environment.constants';
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

export async function elevatedNeo4jWindowsCmd(dbmsRootPath: string, command: string): Promise<string> {
    const neo4jBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, NEO4J_BIN_FILE);

    if (process.platform !== 'win32') {
        throw new NotAllowedError('Elevated commands only allowed in windows environments');
    }

    await fse.access(neo4jBinPath, fse.constants.X_OK).catch(() => {
        throw new NotFoundError(`No DBMS found at "${dbmsRootPath}"`);
    });

    return new Promise((resolve, reject) => {
        // eslint-disable-next-line max-len
        const elevatedCmd = `Start-Process PowerShell -Verb RunAs "-Command \`"cd '$pwd'; & '${neo4jBinPath}' ${command};\`"" -PassThru -Wait`;
        // The JAVA_HOME env is not set here because this method should be
        // used only for windows services, not for running the DBMS.
        const execOptions = {shell: 'powershell'};

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
}
