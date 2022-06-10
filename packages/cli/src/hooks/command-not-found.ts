import {Hook} from '@oclif/core';
import {spawnSync} from 'child_process';
import fse from 'fs-extra';
import path from 'path';

// Simplified version of:
// https://github.com/springernature/hasbin/blob/master/lib/hasbin.js
const binExists = async (bin: string): Promise<boolean> => {
    const envPath = process.env.PATH || '';
    const envExt = process.env.PATHEXT || '';
    const extensions = envExt.split(path.delimiter);

    const searchPaths = envPath
        .replace(/["]+/g, '')
        .split(path.delimiter)
        .map((currentPath) => extensions.map((ext) => path.join(currentPath, bin + ext)))
        .reduce((paths, currentPath) => paths.concat(currentPath), []);

    const tests = searchPaths.map((currentPath) => fse.pathExists(currentPath));

    const results = await Promise.all(tests);
    return results.includes(true);
};

const commandNotFound: Hook<'command_not_found'> = async (options) => {
    const command = `relate-${options.id}`;

    if (await binExists(command)) {
        spawnSync(command, process.argv.slice(3), {
            stdio: 'inherit',
        });
        process.exit(0);
    }
};

export default commandNotFound;
