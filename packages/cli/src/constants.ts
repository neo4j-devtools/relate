import {flags} from '@oclif/command';
import {isInteractive} from './stdin';

export const REQUIRED_FOR_SCRIPTS = !isInteractive();
export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
export const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export const DBMS_FLAGS = {
    environment: flags.string({
        char: 'E',
        description: 'Environment to run the command against',
    }),
};
