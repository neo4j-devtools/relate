import {CLIError} from '@oclif/errors';

export class RequiredArgsError extends CLIError {
    constructor(args: string[]) {
        let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`;
        message += `\n${args}`;
        message += '\nSee more help with --help';

        super(message);
        this.message = message;
    }
}
