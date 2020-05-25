import {google} from 'googleapis';

import {EnvironmentConfigModel, IEnvironmentAuth} from '../models';

import {LocalEnvironment} from './local.environment';
import {AuthenticationError} from '../errors';
import {GOOGLE_AUTHENTICATION_CLIENT_ID, GOOGLE_AUTHENTICATION_CLIENT_SECRET} from '../constants';
import {TokenService} from '../token.service';

export class DemoEnvironment extends LocalEnvironment {
    // @todo: typings;
    private readonly oauth2Client: any;

    constructor(config: EnvironmentConfigModel, configFilePath: string) {
        super(config, configFilePath);

        this.oauth2Client = new google.auth.OAuth2({
            clientId: GOOGLE_AUTHENTICATION_CLIENT_ID,
            clientSecret: GOOGLE_AUTHENTICATION_CLIENT_SECRET,
            redirectUri: `${this.httpOrigin}/authentication/validate`,
        });
    }

    login(redirectTo?: string): Promise<IEnvironmentAuth> {
        return Promise.resolve({
            authUrl: this.oauth2Client.generateAuthUrl({
                // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                access_type: 'offline',
                scope: 'email',
                state: redirectTo,
            }),
            // not used in web environment
            getToken: async (): Promise<{authToken: string}> => ({authToken: ''}),
        });
    }

    async generateAuthToken(code: string): Promise<string> {
        const {tokens} = await this.oauth2Client.getToken({code});

        if (!tokens.id_token) {
            throw new AuthenticationError('Login failed: Unable to extract id token');
        }

        await this.oauth2Client.verifyIdToken({
            audience: GOOGLE_AUTHENTICATION_CLIENT_ID,
            idToken: tokens.id_token,
        });

        return TokenService.sign(tokens);
    }

    async verifyAuthToken(token: string): Promise<void> {
        try {
            const {id_token: idToken} = await TokenService.verify(token);

            await this.oauth2Client.verifyIdToken({
                audience: GOOGLE_AUTHENTICATION_CLIENT_ID,
                idToken,
            });
        } catch (e) {
            throw new AuthenticationError('Failed to validate auth token');
        }
    }
}
