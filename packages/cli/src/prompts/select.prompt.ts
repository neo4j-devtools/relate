import _ from 'lodash';
import {prompt} from 'enquirer';
import {
    AUTHENTICATOR_TYPES,
    Environment,
    IAuthenticationOptions,
    IProjectDbms,
    IGoogleAuthenticationOptions,
    NotFoundError,
    PUBLIC_GRAPHQL_METHODS,
    DBMS_STATUS,
    ENTITY_TYPES,
    InvalidArgumentError,
    SystemProvider,
} from '@relate/common';
import {List} from '@relate/types';

import {inputPrompt} from './input.prompt';
import {getEntityDisplayName} from '../utils/display.utils';

interface IChoice {
    name: string;
    message?: string;
    value?: string;
    hint?: string;
    disabled?: boolean | string;
}

export const selectPrompt = async (message: string, choices: string[] | IChoice[]): Promise<string> => {
    const {selection} = await prompt({
        message,
        choices,
        name: 'selection',
        type: 'select',
    });

    return selection;
};

export const selectEntityPrompt = async (
    message: string,
    environment: Environment,
    entityType: ENTITY_TYPES,
): Promise<string> => {
    let options: List<IChoice>;

    switch (entityType) {
        case ENTITY_TYPES.DBMS: {
            options = (await environment.dbmss.list()).mapEach((dbms) => ({
                name: dbms.name,
                value: dbms.id,
            }));
            break;
        }

        case ENTITY_TYPES.PROJECT: {
            options = (await environment.projects.list()).mapEach((project) => ({
                name: project.name,
                value: project.id,
            }));
            break;
        }

        default: {
            throw new InvalidArgumentError(`Cannot select ${entityType} entities`);
        }
    }

    return selectPrompt(message, options.toArray());
};

export const confirmPrompt = async (message: string): Promise<boolean> => {
    const {confirmed} = await prompt({
        message,
        name: 'confirmed',
        type: 'confirm',
    });

    return confirmed;
};

export const selectMultiplePrompt = async <R = string>(
    message: string,
    choices: string[] | IChoice[],
): Promise<R[]> => {
    const {selection} = await prompt({
        message,
        choices,
        name: 'selection',
        type: 'multiselect',
    });

    return selection;
};

export const selectEnvironmentPrompt = async (message: string, systemProvider: SystemProvider): Promise<string> => {
    const environments = await systemProvider.listEnvironments();
    if (!environments.length) {
        throw new NotFoundError('No environment available', ['Run "relate env:init" and try again']);
    }

    const choices = environments
        .mapEach((env) => ({
            name: env.id,
            message: getEntityDisplayName(env),
        }))
        .toArray();

    return selectPrompt(message, choices);
};

export const selectDbmsPrompt = async (
    message: string,
    environment: Environment,
    filter?: DBMS_STATUS,
): Promise<string> => {
    let dbmss = (await environment.dbmss.list()).toArray();
    if (!dbmss.length) {
        throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
    }

    if (filter) {
        const infoDbmss = (await environment.dbmss.info(_.map(dbmss, (dbms) => dbms.id))).toArray();
        dbmss = _.compact(
            _.map(dbmss, (dbms, index) => {
                if (infoDbmss[index].status === filter) {
                    return dbms;
                }
                return null;
            }),
        );
    }

    if (!dbmss.length) {
        throw new NotFoundError(`All DBMSs are currently ${filter === DBMS_STATUS.STARTED ? 'stopped' : 'started'}`);
    }

    return selectPrompt(
        message,
        dbmss.map((dbms) => ({
            name: dbms.id,
            message: getEntityDisplayName(dbms),
        })),
    );
};

export const selectDbmssPrompt = async (
    message: string,
    environment: Environment,
    filter?: DBMS_STATUS,
): Promise<string[]> => {
    let dbmss = (await environment.dbmss.list()).toArray();
    if (!dbmss.length) {
        throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
    }

    if (filter) {
        const infoDbmss = (await environment.dbmss.info(_.map(dbmss, (dbms) => dbms.id))).toArray();
        dbmss = _.compact(
            _.map(dbmss, (dbms, index) => {
                if (infoDbmss[index].status === filter) {
                    return dbms;
                }
                return null;
            }),
        );
    }

    if (!dbmss.length) {
        throw new NotFoundError(`All DBMSs are currently ${filter === DBMS_STATUS.STARTED ? 'stopped' : 'started'}`);
    }

    return selectMultiplePrompt(
        message,
        dbmss.map((dbms) => ({
            name: dbms.id,
            message: getEntityDisplayName(dbms),
        })),
    );
};

export const selectProjectPrompt = async (message: string, environment: Environment): Promise<string> => {
    const projects = (await environment.projects.list()).toArray();

    if (!projects.length) {
        throw new NotFoundError('No projects found', ['Run "relate project:init" and try again']);
    }

    return selectPrompt(
        message,
        projects.map((project) => ({
            name: project.name,
            message: project.name,
        })),
    );
};

export const selectProjectDbmsPrompt = (message: string, projectDbmss: IProjectDbms[]): Promise<string> => {
    if (!projectDbmss.length) {
        throw new NotFoundError('No project dbmss found');
    }

    return selectPrompt(
        message,
        projectDbmss.map((dbms) => ({
            name: dbms.name,
            message: dbms.name,
        })),
    );
};

export const selectAppPrompt = async (message: string, environment: Environment): Promise<string> => {
    const installedApps = (await environment.extensions.listApps()).toArray();

    return selectPrompt(
        message,
        installedApps.map((app) => ({
            name: app.name,
            message: app.name,
        })),
    );
};

export const googleAuthenticatorPrompt = async (): Promise<IGoogleAuthenticationOptions> => {
    const clientId = await inputPrompt('OAuth Client ID');
    const clientSecret = await inputPrompt('OAuth Client Secret');

    return {
        type: AUTHENTICATOR_TYPES.GOOGLE_OAUTH2,
        clientId,
        clientSecret,
    };
};

export const selectAllowedMethodsPrompt = async (): Promise<PUBLIC_GRAPHQL_METHODS[]> => {
    const needsWhitelist = await confirmPrompt('Do you need to restrict access to the GraphQL API methods?');

    if (!needsWhitelist) {
        return [];
    }
    const choices: {name: PUBLIC_GRAPHQL_METHODS}[] = _.map(
        _.values(PUBLIC_GRAPHQL_METHODS),
        (name: PUBLIC_GRAPHQL_METHODS) => ({name}),
    );

    return selectMultiplePrompt<PUBLIC_GRAPHQL_METHODS>('Select allowed GraphQL API methods', choices);
};

export const selectAuthenticatorPrompt = async (): Promise<IAuthenticationOptions | undefined> => {
    const needsAuthentication = await confirmPrompt('Do you need to enable authentication?');

    if (!needsAuthentication) {
        return undefined;
    }

    const type = await selectPrompt(
        'Authentication type',
        _.map(_.values(AUTHENTICATOR_TYPES), (name) => ({name})),
    );

    switch (type) {
        case AUTHENTICATOR_TYPES.GOOGLE_OAUTH2:
            return googleAuthenticatorPrompt();
        case AUTHENTICATOR_TYPES.CLIENT:
            return {type};
        default:
            return undefined;
    }
};
