import _ from 'lodash';
import {prompt} from 'enquirer';
import {
    AUTHENTICATOR_TYPES,
    Environment,
    GoogleAuthenticatorOptions,
    IExtensionMeta,
    IProjectDbms,
    NotFoundError,
    PUBLIC_GRAPHQL_METHODS,
    DBMS_STATUS,
} from '@relate/common';

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

export const selectMultiplePrompt = async (message: string, choices: string[] | IChoice[]): Promise<string[]> => {
    const {selection} = await prompt({
        message,
        choices,
        name: 'selection',
        type: 'multiselect',
    });

    return selection;
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

export const selectProjectPrompt = async (message: string, environment: Environment): Promise<string> => {
    const projects = (await environment.projects.list()).toArray();

    if (!projects.length) {
        throw new NotFoundError('No projects found', ['Run "relate project:init" and try again']);
    }

    return selectPrompt(
        message,
        projects.map((project) => ({
            name: project.name,
            message: getEntityDisplayName(project),
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

export const selectAppPrompt = (message: string, installedApps: IExtensionMeta[]): Promise<string> => {
    return selectPrompt(
        message,
        installedApps.map((app) => ({
            name: app.name,
            message: app.name,
        })),
    );
};

export const googleAuthenticatorPrompt = async (): Promise<GoogleAuthenticatorOptions> => {
    const authenticationUrl = await inputPrompt('Authentication request URL (optional)');
    const redirectUrl = await inputPrompt('Authentication redirect URL (must match OAuth credentials)');
    const verificationUrl = await inputPrompt('Authentication verification URL (optional)');
    const clientId = await inputPrompt('OAuth Client ID');
    const clientSecret = await inputPrompt('OAuth Client Secret');

    return {
        type: AUTHENTICATOR_TYPES.GOOGLE_OAUTH2,
        authenticationUrl: authenticationUrl || undefined,
        redirectUrl,
        verificationUrl: verificationUrl || undefined,
        clientId,
        clientSecret,
    };
};

export const selectAllowedMethodsPrompt = async (): Promise<string[]> => {
    const needsWhitelist = await selectPrompt('Do you need to restrict access to the GraphQL API methods?', [
        {name: 'Yes'},
        {name: 'No'},
    ]);

    if (needsWhitelist === 'No') {
        return [];
    }

    return selectMultiplePrompt(
        'Select allowed GraphQL API methods',
        _.map(_.values(PUBLIC_GRAPHQL_METHODS), (name) => ({name})),
    );
};

export const selectAuthenticatorPrompt = async (): Promise<GoogleAuthenticatorOptions | undefined> => {
    const needsWhitelist = await selectPrompt('Do you need to enable authentication?', [{name: 'Yes'}, {name: 'No'}]);

    if (needsWhitelist === 'No') {
        return undefined;
    }

    const type = await selectPrompt(
        'Authentication type',
        _.map(_.values(AUTHENTICATOR_TYPES), (name) => ({name})),
    );

    switch (type) {
        case AUTHENTICATOR_TYPES.GOOGLE_OAUTH2:
            return googleAuthenticatorPrompt();
        default:
            return undefined;
    }
};
