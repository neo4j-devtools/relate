import {google} from 'googleapis';
import fetch from 'node-fetch';

import {oAuthRedirectServer} from '../oauth-utils';
import {LOCALHOST_IP_ADDRESS} from '../environment.constants';
import {AuthenticationError} from '../../errors';
import {TokenService} from '../../token.service';
import {IAuthenticator, IAuthenticatorOptions} from './index';
import {AUTH_TOKEN_KEY} from '../../constants';
import {AuthenticatorModel} from '../../models/authenticator.model';

export interface IGoogleAuthenticatorOptions extends IAuthenticatorOptions {
    clientId: string;
    clientSecret: string;
}

export const LOCAL_OAUTH_REDIRECT = `http://${LOCALHOST_IP_ADDRESS}:5555`;

export function googleAuthenticatorFactory(options: IGoogleAuthenticatorOptions): IAuthenticator {
    const {
        httpOrigin,
        authenticationUrl,
        redirectUrl,
        verificationUrl,
        clientId,
        clientSecret,
    } = new AuthenticatorModel(options);
    const oAuth2Client = new google.auth.OAuth2({
        clientId,
        clientSecret,
        redirectUri: redirectUrl,
    });

    const authenticator: IAuthenticator = {
        async login(redirectTo?: string) {
            let redirectUri = redirectUrl;

            try {
                // @todo: Investigate better way for CLI OAuth?
                if (redirectTo && new URL(redirectTo).origin !== httpOrigin) {
                    redirectUri = redirectTo;
                }
            } catch (_e) {}

            /* eslint-disable indent */
            const authUrl = authenticationUrl
                ? `${authenticationUrl}?redirectTo=${redirectUri}`
                : oAuth2Client.generateAuthUrl({
                      // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                      access_type: 'offline',
                      // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                      redirect_uri: redirectUri,
                      scope: 'email',
                      state: redirectTo,
                  });
            /* eslint-enable indent */

            return {
                authUrl,
                // not used in web environments
                async getToken(): Promise<{authToken: string; redirectTo?: string}> {
                    const code = await oAuthRedirectServer({
                        host: new URL(LOCAL_OAUTH_REDIRECT).hostname,
                        port: new URL(LOCAL_OAUTH_REDIRECT).port,
                    });
                    const authToken = await authenticator.generateAuthToken(code);

                    return {
                        authToken,
                        redirectTo,
                    };
                },
            };
        },
        async generateAuthToken(code: string): Promise<string> {
            const {tokens} = await oAuth2Client.getToken({code});

            if (!tokens.id_token) {
                throw new AuthenticationError('Login failed: Unable to extract id token');
            }

            const authToken = await TokenService.sign(tokens);

            await authenticator.verifyAuthToken(authToken);

            return authToken;
        },
        async verifyAuthToken(token: string): Promise<void> {
            if (verificationUrl) {
                await fetch(verificationUrl, {
                    headers: {
                        [AUTH_TOKEN_KEY]: token,
                    },
                }).then((res) => {
                    if (!res.ok) {
                        throw new AuthenticationError(
                            `Unable to verify authentication, ${res.status}: ${res.statusText}`,
                        );
                    }
                });
                return;
            }

            try {
                const {id_token: idToken} = await TokenService.verify(token);

                await oAuth2Client.verifyIdToken({
                    audience: clientId,
                    idToken,
                });
            } catch (e) {
                throw new AuthenticationError('Failed to validate auth token');
            }
        },
    };

    return authenticator;
}
