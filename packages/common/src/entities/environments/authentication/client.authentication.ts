import fetch from 'node-fetch';

import {IAuthentication} from './authentication.types';
import {authRedirectServer} from './auth-utils';
import {AuthenticationError, NotAllowedError} from '../../../errors';
import {AUTH_TOKEN_KEY} from '../../../constants';
import {LOCALHOST_IP_ADDRESS} from '../environment.constants';
import {EnvironmentAbstract} from '../environment.abstract';
import {AUTHENTICATION_ENDPOINT, VERIFICATION_ENDPOINT} from './authentication.constants';

export const LOCAL_OAUTH_REDIRECT = `http://${LOCALHOST_IP_ADDRESS}:5555`;

export class ClientAuthentication implements IAuthentication {
    constructor(protected readonly env: EnvironmentAbstract) {}

    login(redirectTo?: string) {
        const authRedirect = redirectTo ? `?redirectTo=${redirectTo}` : '';

        return Promise.resolve({
            authUrl: `${this.env.httpOrigin}${AUTHENTICATION_ENDPOINT}${authRedirect}`,
            // only used in CLI
            getToken(): Promise<string> {
                return authRedirectServer({
                    host: new URL(LOCAL_OAUTH_REDIRECT).hostname,
                    port: new URL(LOCAL_OAUTH_REDIRECT).port,
                });
            },
        });
    }

    generateAuthToken(_data: any): Promise<string> {
        throw new NotAllowedError('Clients cannot generate tokens');
    }

    async verifyAuthToken(token: string): Promise<void> {
        try {
            await fetch(`${this.env.httpOrigin}${VERIFICATION_ENDPOINT}`, {
                headers: {
                    [AUTH_TOKEN_KEY]: token,
                },
            }).then((res) => {
                if (!res.ok) {
                    throw new AuthenticationError(`Unable to verify authentication, ${res.status}: ${res.statusText}`);
                }
            });
        } catch (e) {
            throw new AuthenticationError('Failed to validate auth token');
        }
    }
}
