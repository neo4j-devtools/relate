import {google} from 'googleapis';

import {AuthenticationError, NotAllowedError} from '../../../errors';
import {TokenService} from '../../../token.service';
import {IAuthentication, IAuthenticationOptions} from './authentication.types';
import {EnvironmentAbstract} from '../environment.abstract';
import {VALIDATION_ENDPOINT} from './authentication.constants';

export interface IGoogleAuthenticationOptions extends IAuthenticationOptions {
    clientId: string;
    clientSecret: string;
}

export class GoogleAuthentication implements IAuthentication {
    protected readonly oAuth2Client = new google.auth.OAuth2({
        clientId: this.options.clientId,
        clientSecret: this.options.clientSecret,
        redirectUri: `${this.env.httpOrigin}${VALIDATION_ENDPOINT}`,
    });

    constructor(
        protected readonly env: EnvironmentAbstract,
        protected readonly options: IGoogleAuthenticationOptions,
    ) {}

    login(redirectTo?: string) {
        const authUrl = this.oAuth2Client.generateAuthUrl({
            // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
            access_type: 'offline',
            scope: 'email',
            state: redirectTo,
        });

        return Promise.resolve({
            authUrl,
            // only used in clients
            getToken(): Promise<string> {
                throw new NotAllowedError('Authentication providers not allowed to spawn oauth clients');
            },
        });
    }

    async generateAuthToken(code: string): Promise<string> {
        const {tokens} = await this.oAuth2Client.getToken({code});

        if (!tokens.id_token) {
            throw new AuthenticationError('Login failed: Unable to extract id token');
        }

        const authToken = await TokenService.sign(tokens);

        await this.verifyAuthToken(authToken);

        return authToken;
    }

    async verifyAuthToken(token: string): Promise<void> {
        try {
            const {id_token: idToken} = await TokenService.verify(token);

            await this.oAuth2Client.verifyIdToken({
                audience: this.options.clientId,
                idToken,
            });
        } catch (e) {
            throw new AuthenticationError('Failed to validate auth token');
        }
    }
}
