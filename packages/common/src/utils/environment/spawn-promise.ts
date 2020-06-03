import {spawn, SpawnOptionsWithoutStdio} from 'child_process';

export const spawnPromise = (
    command: string,
    args: string[] = [],
    options: SpawnOptionsWithoutStdio = {},
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const process = spawn(command, args, options);

        const data: string[] = [];
        const collect = (chunk: Buffer): void => {
            data.push(chunk.toString());
        };

        process.stderr.on('data', collect);
        process.stderr.on('error', reject);
        process.stderr.on('close', () => resolve(data.join('')));
        process.stderr.on('end', () => resolve(data.join('')));

        process.stdout.on('data', collect);
        process.stdout.on('error', reject);
        process.stdout.on('close', () => resolve(data.join('')));
        process.stdout.on('end', () => resolve(data.join('')));
    });
};
