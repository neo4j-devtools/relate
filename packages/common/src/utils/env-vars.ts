export class EnvVars {
    private env: {[key: string]: string | undefined} = {};

    constructor(options: {cloneFromProcess: boolean}) {
        if (options && options.cloneFromProcess) {
            this.env = {...process.env};
        }
    }

    set(key: string, value: string | undefined): void {
        if (process.platform !== 'win32') {
            this.env[key] = value;
            return;
        }

        // Windows environment variables are case insensitive
        const targetKey = Object.keys(this.env).find((k) => k && k.toLowerCase() === key.toLowerCase());
        this.env[targetKey || key] = value;
    }

    get(key: string): string | undefined {
        if (process.platform !== 'win32') {
            return this.env[key];
        }

        // Windows environment variables are case insensitive
        const targetKey = Object.keys(this.env).find((k) => k && k.toLowerCase() === key.toLowerCase());
        return this.env[targetKey || key];
    }

    toObject(): {[key: string]: string | undefined} {
        return {...this.env};
    }
}
