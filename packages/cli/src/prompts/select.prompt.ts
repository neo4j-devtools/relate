import _ from 'lodash';
import {prompt} from 'enquirer';
import {AUTHENTICATOR_TYPES, Environment, AuthenticatorOptions, IExtensionMeta, NotFoundError, PUBLIC_ENVIRONMENT_METHODS, DBMS_STATUS} from '@relate/common';

import {inputPrompt} from './input.prompt';

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
    let dbmss = await environment.listDbmss();
    if (!dbmss.length) {
        throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
    }

    if (filter) {
        const infoDbmss = await environment.infoDbmss(_.map(dbmss, (dbms) => dbms.id));
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
        throw new NotFoundError(
            `All DBMSs are currently ${filter === DBMS_STATUS.STARTED ? 'stopped' : 'started'}`,
        );
    }

    return selectPrompt(
        message,
        dbmss.map((dbms) => ({
            name: dbms.id,
            message: `[${dbms.id.slice(0, 8)}] ${dbms.name}`,
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

export const selectAuthenticatorPrompt = async (): Promise<AuthenticatorOptions | undefined> => {
    const needsWhitelist = await selectPrompt('Do you need to enable authentication?', [{name: 'Yes'}, {name: 'No'}]);

    if (needsWhitelist === 'No') {
        return undefined;
    }

    const type = await selectPrompt('Authentication type', _.map(_.values(AUTHENTICATOR_TYPES), (name) => ({name})));

    switch (type) {
        case AUTHENTICATOR_TYPES.GOOGLE_OAUTH2:
            return googleAuthenticatorPrompt()
        default:
            return undefined
    }
};

export const googleAuthenticatorPrompt = async (): Promise<AuthenticatorOptions> => {
    const authenticationUrl = await inputPrompt('Authentication request URL (optional)',);
    const redirectUrl = await inputPrompt('Authentication redirect URL (must match OAuth credentials)', '', true);
    const verificationUrl = await inputPrompt('Authentication verification URL (optional)');
    const clientId = await inputPrompt('OAuth Client ID', '', true);
    const clientSecret = await inputPrompt('OAuth Client Secret', '', true);

    console.log(redirectUrl);

    return {
        type: AUTHENTICATOR_TYPES.GOOGLE_OAUTH2,
        authenticationUrl: authenticationUrl || undefined,
        redirectUrl,
        verificationUrl: verificationUrl || undefined,
        clientId,
        clientSecret,
    }
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
        _.map(_.values(PUBLIC_ENVIRONMENT_METHODS), (name) => ({name})),
    );
};
