import fse from 'fs-extra';
import path from 'path';
import {spawn} from 'child_process';
import kill from 'tree-kill';

import {resolveRelateJavaHome} from './resolve-java';
import {EnvVars} from '../env-vars';
import {
    NEO4J_LOGS_DIR,
    NEO4J_RUN_DIR,
    NEO4J_BIN_DIR,
    NEO4J_RELATE_PID_FILE,
    NEO4J_LOG_FILE,
    NEO4J_VERSION_5X,
} from '../../entities/environments';
import {DBMS_STATUS} from '../../constants';
import {getDistributionVersion} from './dbms-versions';
import {envPaths} from '../env-paths';
import {satisfies} from 'semver';

const getRunningNeo4jPid = async (dbmsRoot: string): Promise<number | null> => {
    const neo4jPidPath = path.join(dbmsRoot, NEO4J_RUN_DIR, NEO4J_RELATE_PID_FILE);

    const pidExists = await fse.pathExists(neo4jPidPath);
    if (!pidExists) {
        return null;
    }
    const pid = await fse.readFile(neo4jPidPath).then((buf) => Number(buf));

    try {
        // Sending signal 0 can be used as a platform independent way to test for the existence of a process.
        process.kill(pid, 0);
        return pid;
    } catch {
        return null;
    }
};

const removePidFile = async (dbmsRoot: string): Promise<void> => {
    const neo4jPidPath = path.join(dbmsRoot, NEO4J_RUN_DIR, NEO4J_RELATE_PID_FILE);
    await fse.remove(neo4jPidPath);
};

export const winNeo4jStart = async (dbmsRoot: string, version: string | undefined): Promise<string> => {
    const existingPid = await getRunningNeo4jPid(dbmsRoot);
    if (existingPid) {
        return 'neo4j already running';
    }

    const {version: dbmsVersion} = await getDistributionVersion(dbmsRoot);
    const relateJavaHome = await resolveRelateJavaHome(dbmsVersion);

    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    env.set('NEO4J_ACCEPT_LICENSE_AGREEMENT', 'yes');

    if (relateJavaHome) {
        const defaultPath = env.get('PATH');

        // relateJavaHome is prepended to the PATH in order to take
        // precedence over any user installed JAVA executable.
        env.set('PATH', `${relateJavaHome}${path.delimiter}${defaultPath}`);
    }

    const isDbmsVersion5 = !version || satisfies(version, NEO4J_VERSION_5X, {includePrerelease: true});

    // Neo4j 5 is always writing logs to the neo4j.log file, which means we
    // can't write the logs through Powershell in the same file, because then
    // both processes (the Powershell script and Neo4j) will try to get a handle
    // of the same file and Neo4j, arriving later, will fail to do so and will
    // crash on startup.
    const logFileName = isDbmsVersion5 ? 'neo4j-relate.log' : NEO4J_LOG_FILE;
    const logFilePath = path.join(dbmsRoot, NEO4J_LOGS_DIR, logFileName);
    const neo4jPs1Path = path.join(dbmsRoot, NEO4J_BIN_DIR, 'neo4j.ps1');

    // When Relate is packaged as an Electron dependency, files inside the
    // relate package are not executable. To avoid issues the starter script is
    // copied in the cache directory and it's executed from there.
    const cachedNeo4jStarterPath = path.join(envPaths().cache, 'neo4j-start.ps1');
    const relateNeo4jStarterPath = path.resolve(__dirname, '..', '..', '..', 'neo4j-start.ps1');

    if (!(await fse.pathExists(cachedNeo4jStarterPath))) {
        await fse.copyFile(relateNeo4jStarterPath, cachedNeo4jStarterPath);
    }

    const child = spawn(
        'powershell.exe',
        [
            '-ExecutionPolicy',
            'Bypass',
            '-File',
            `"${cachedNeo4jStarterPath}"`,
            '-binPath',
            `"${neo4jPs1Path}"`,
            '-logsPath',
            `"${logFilePath}"`,
        ],
        {
            detached: true,
            // Windows scripts are not executable on their own and need a shell to be able to run.
            shell: true,
            // stdio has to be set to 'ignore' or the node process will wait for the child
            // process to exit first, effectively making it not detached.
            stdio: 'ignore',
            env: env.toObject(),
        },
    );

    const neo4jPidPath = path.join(dbmsRoot, NEO4J_RUN_DIR, NEO4J_RELATE_PID_FILE);
    await fse.writeFile(neo4jPidPath, `${child.pid}`);
    child.unref();

    return 'neo4j started';
};

export const winNeo4jStop = async (dbmsRoot: string): Promise<string> => {
    const pid = await getRunningNeo4jPid(dbmsRoot);

    // @todo add retries
    if (pid) {
        kill(pid);
        await removePidFile(dbmsRoot);
    }

    return 'neo4j stopped';
};

export const winNeo4jStatus = async (dbmsRoot: string): Promise<DBMS_STATUS> => {
    if (await getRunningNeo4jPid(dbmsRoot)) {
        return DBMS_STATUS.STARTED;
    }

    await removePidFile(dbmsRoot);
    return DBMS_STATUS.STOPPED;
};
