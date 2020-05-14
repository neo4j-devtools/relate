import {map, filter} from 'lodash';

export function isInteractive(): boolean {
    return process.stdin.isTTY || false;
}

export function readStdin(): Promise<string> {
    let result = '';

    return new Promise((resolve) => {
        if (process.stdin.isTTY) {
            resolve(result);
            return;
        }

        process.stdin.setEncoding('utf8');

        process.stdin.on('readable', () => {
            let chunk;

            while ((chunk = process.stdin.read())) {
                result += chunk;
            }
        });

        process.stdin.on('end', () => {
            resolve(result);
        });
    });
}

export async function readStdinArray(): Promise<string[]> {
    const stdin = await readStdin();
    const rawLines = stdin.trim().split(/\n|\t/g);
    const cleanLines = map(rawLines, (rawLine) => rawLine.trim());

    return filter(cleanLines, (cleanLine) => cleanLine !== '');
}
