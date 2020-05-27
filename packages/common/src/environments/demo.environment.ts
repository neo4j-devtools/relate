import {google} from 'googleapis';

import {EnvironmentConfigModel, IDbmsVersion, IEnvironmentAuth} from '../models';

import {LocalEnvironment} from './local.environment';
import {AuthenticationError, NotAllowedError} from '../errors';
import {GOOGLE_AUTHENTICATION_CLIENT_ID, GOOGLE_AUTHENTICATION_CLIENT_SECRET} from '../constants';
import {TokenService} from '../token.service';
import {IExtensionMeta, IExtensionVersion} from './local.environment/utils';

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
        let redirectUri = `${this.httpOrigin}/authentication/validate`;

        try {
            // @todo: Investigate better way for CLI OAuth?
            if (redirectTo && new URL(redirectTo).origin !== this.httpOrigin) {
                redirectUri = redirectTo;
            }
        } catch (_e) {
            // not handled
        }

        return Promise.resolve({
            authUrl: this.oauth2Client.generateAuthUrl({
                // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                access_type: 'offline',
                // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                redirect_uri: redirectUri,
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

    listInstalledExtensions(): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing installed extensions`);
    }

    listDbmsVersions(): Promise<IDbmsVersion[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing DBMS versions`);
    }

    installDbms(_name: string, _credentials: string, _version: string): Promise<string> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support installing a DBMS`);
    }

    uninstallDbms(_name: string): Promise<void> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support uninstalling a DBMS`);
    }

    startDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support starting DBMSs`);
    }

    stopDbmss(_dbmsIds: string[]): Promise<string[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support stopping DBMSs`);
    }

    updateDbmsConfig(_dbmsId: string, _properties: Map<string, string>): Promise<void> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support updating DBMSs config`);
    }

    linkExtension(_filePath: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support linking extensions`);
    }

    installExtension(_name: string, _version: string): Promise<IExtensionMeta> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support installing extensions`);
    }

    uninstallExtension(_name: string): Promise<IExtensionMeta[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support uninstalling extensions`);
    }

    listExtensionVersions(): Promise<IExtensionVersion[]> {
        throw new NotAllowedError(`${DemoEnvironment.name} does not support listing extension versions`);
    }
}
