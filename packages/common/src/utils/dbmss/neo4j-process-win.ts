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
    NEO4J_BIN_FILE,
    NEO4J_RELATE_PID_FILE,
    NEO4J_LOG_FILE,
} from '../../entities/environments';
import {DBMS_STATUS} from '../../constants';

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

export const winNeo4jStart = async (dbmsRoot: string): Promise<string> => {
    const existingPid = await getRunningNeo4jPid(dbmsRoot);
    if (existingPid) {
        return 'neo4j already running';
    }

    const logFilePath = path.join(dbmsRoot, NEO4J_LOGS_DIR, NEO4J_LOG_FILE);
    await fse.ensureFile(logFilePath);

    const relateJavaHome = await resolveRelateJavaHome();
    const env = new EnvVars({cloneFromProcess: true});
    env.set('JAVA_HOME', relateJavaHome || process.env.JAVA_HOME);
    // relateJavaHome is prepended to the PATH in order to take
    // precedence over any user installed JAVA executable.
    env.set('PATH', relateJavaHome ? `${relateJavaHome}${path.delimiter}${process.env.PATH}` : process.env.PATH);

    const neo4jBinPath = path.join(dbmsRoot, NEO4J_BIN_DIR, NEO4J_BIN_FILE);
    const child = spawn(neo4jBinPath, ['console'], {
        detached: true,
        shell: true,
        windowsHide: true,
        stdio: 'ignore',
        env: env.toObject(),
    });

    const neo4jPidPath = path.join(dbmsRoot, NEO4J_RUN_DIR, NEO4J_RELATE_PID_FILE);
    await fse.writeFile(neo4jPidPath, child.pid);
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
