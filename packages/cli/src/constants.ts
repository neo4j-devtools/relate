import {flags} from '@oclif/command';
import {isInteractive} from './stdin';

export const REQUIRED_FOR_SCRIPTS = !isInteractive();
export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
export const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export const ARGS = {
    DBMS: {
        description: 'Name or ID of a Neo4j instance',
        name: 'dbms',
        required: REQUIRED_FOR_SCRIPTS,
    },
    DBMSS: {
        description: 'Names or IDs of Neo4j instances',
        name: 'dbmss',
    },
    ENVIRONMENT: {
        description: 'Name of the environment to run the command against',
        name: 'environment',
    },
    VERSION: {
        description: 'Version to install (semver, url, or path)',
        name: 'version',
        required: REQUIRED_FOR_SCRIPTS,
    },
};

export const FLAGS = {
    ENVIRONMENT: {
        environment: flags.string({
            char: 'e',
            description: 'Name of the environment to run the command against',
            required: false,
        }),
    },
    PROJECT: {
        project: flags.string({
            char: 'p',
            description: 'Name of the project to run the command against',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    },
};

export interface IInputPromptOptions {
    initial?: string;
    required?: boolean;
}
