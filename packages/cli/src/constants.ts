import {flags} from '@oclif/command';

export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';

export const DBMS_FLAGS = {
    account: flags.string({
        char: 'A',
        description: 'Account to run the command against',
    }),
};
export const DEFAULT_WEB_HOST = 'http://localhost:3000';
