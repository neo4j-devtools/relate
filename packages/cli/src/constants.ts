import {flags} from '@oclif/command';

export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';

export const DBMS_FLAGS = {
    account: flags.string({
        char: 'A',
        description: 'Account to run the command against',
        default: 'default',
    }),
};
