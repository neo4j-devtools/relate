import {flags} from '@oclif/command';
import {isInteractive} from './stdin';

export const REQUIRED_FOR_SCRIPTS = !isInteractive();
export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
export const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export const ARGS = {
    DBMSS: {
        name: 'dbmss',
        description: 'Names or IDs of Neo4j instances',
    },
    DBMS: {
        name: 'dbms',
        description: 'Name or ID of a Neo4j instance',
        required: REQUIRED_FOR_SCRIPTS,
    },
    VERSION: {
        name: 'version',
        description: 'Version to install (semver, url, or path)',
        required: REQUIRED_FOR_SCRIPTS,
    },
};

export const FLAGS = {
    ENVIRONMENT: {
        environment: flags.string({
            char: 'e',
            description: 'Name of the environment to run the command against',
            default: 'default',
        }),
    },
};

// @todo - it might be best to move this to common
export enum DBMS_STATUS_FILTERS {
    START = 'Neo4j is not running',
    STOP = 'Neo4j is running',
}
