import {Args, Flags} from '@oclif/core';
import {ENTITY_TYPES} from '@relate/common';

import {isInteractive} from './stdin';

export const REQUIRED_FOR_SCRIPTS = !isInteractive();
export const IS_DEVELOPMENT_ENV = process.env.NODE_ENV === 'development';
export const IS_TEST_ENV = process.env.NODE_ENV === 'test';

export const ARGS = {
    DBMS: {
        dbms: Args.string({
            description: 'Name or ID of a Neo4j instance',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    },
    DBMSS: {
        dbmss: Args.string({
            description: 'Names or IDs of Neo4j instances',
        }),
    },
    ENVIRONMENT: {
        environment: Args.string({
            description: 'Name of the environment to run the command against',
        }),
    },
    VERSION: {
        version: Args.string({
            description: 'Version to install (semver, url, or path)',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    },
};

export const FLAGS = {
    ENVIRONMENT: {
        environment: Flags.string({
            char: 'e',
            description: 'Name of the environment to run the command against',
            required: false,
        }),
    },
    PROJECT: {
        project: Flags.string({
            char: 'p',
            description: 'Name of the project to run the command against',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    },
    VERSION: {
        version: Flags.string({
            char: 'v',
            description: 'Version to install (semver, url, or path)',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    },
};

export interface IInputPromptOptions {
    initial?: string;
    required?: boolean;
}

export interface IPromptSelection<T> {
    selection: T;
}

export const VALID_BACKUP_TYPES = [ENTITY_TYPES.DBMS, ENTITY_TYPES.PROJECT];
