export function isTTY(): boolean {
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
