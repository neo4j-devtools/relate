import fse, {ReadStream} from 'fs-extra';
import path from 'path';
import {Transform} from 'stream';

import {NotFoundError, DependencyError} from '../../errors';
import {NEO4J_BIN_DIR, CYPHER_SHELL_BIN_FILE} from '../../entities/environments/environment.constants';
import {resolveRelateJavaHome} from './resolve-java';
import {spawnPromise} from './spawn-promise';
import {EnvVars} from '../env-vars';
import {getDistributionVersion} from './dbms-versions';

const appendSemicolon = (): Transform => {
    let finalChunk: string;
    return new Transform({
        emitClose: true,
        transform: (data, _, next) => {
            finalChunk = data;
            next(null, data);
        },
        flush: (next) => {
            if (finalChunk !== undefined) {
                const finalChunkString = Buffer.isBuffer(finalChunk) ? finalChunk.toString() : finalChunk;
                if (!finalChunkString.trim().endsWith(';')) {
                    next(null, ';');
                } else {
                    next();
                }
            } else {
                next();
            }
        },
    });
};

export async function cypherShellCmd(
    dbmsRootPath: string,
    args: string[],
    from: string | ReadStream,
    credentials?: string,
): Promise<string> {
    const cypherShellBinPath = path.join(dbmsRootPath, NEO4J_BIN_DIR, CYPHER_SHELL_BIN_FILE);
    const dbmsVersion = await getDistributionVersion(dbmsRootPath);
    const relateJavaHome = await resolveRelateJavaHome(dbmsVersion);

    let stream;
    if (typeof from === 'string' || from instanceof String) {
        const file = path.resolve(from as string);
        try {
            await fse.ensureFile(file);
        } catch (e) {
            throw new NotFoundError(`File not found (${file})`);
        }
        stream = fse.createReadStream(file);
    } else {
        stream = from;
    }

    stream = stream.pipe(appendSemicolon());

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

    if (output.includes('Neo4j cannot be started using java version')) {
        throw new DependencyError(output);
    }

    return output;
}
