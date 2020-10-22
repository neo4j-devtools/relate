import {spawn, SpawnOptionsWithoutStdio} from 'child_process';
import {ReadStream} from 'fs-extra';
import {Transform} from 'stream';

export const spawnPromise = (
    command: string,
    args: string[] = [],
    options: SpawnOptionsWithoutStdio = {},
    stream: ReadStream | Transform | undefined = undefined,
): Promise<string> => {
    return new Promise((resolve, reject) => {
        let commandEscaped = command;
        if (process.platform === 'win32') {
            // https://nodejs.org/api/child_process.html#child_process_spawning_bat_and_cmd_files_on_windows
            commandEscaped = `"${command}"`;
            options.shell = true;
        }

        const child = spawn(commandEscaped, args, options);

        if (stream) {
            stream.pipe(child.stdin);
        }

        const data: string[] = [];
        const collect = (chunk: Buffer): void => {
            data.push(chunk.toString());
        };

        child.stderr.on('data', collect);
        child.stderr.on('error', reject);
        child.stderr.on('close', () => resolve(data.join('')));
        child.stderr.on('end', () => resolve(data.join('')));

        child.stdout.on('data', collect);
        child.stdout.on('error', reject);
        child.stdout.on('close', () => resolve(data.join('')));
        child.stdout.on('end', () => resolve(data.join('')));
    });
};
