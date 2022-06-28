import {Errors} from '@oclif/core';

export class RequiredArgsError extends Errors.CLIError {
    constructor(args: string[]) {
        let message = `Missing ${args.length} required arg${args.length === 1 ? '' : 's'}`;
        message += `\n${args}`;
        message += '\nSee more help with --help';

        super(message);
        this.message = message;
    }
}
