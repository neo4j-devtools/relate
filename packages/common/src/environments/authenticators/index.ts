import {IEnvironmentAuth} from '../../models';
import {AUTHENTICATOR_TYPES} from '../environment.constants';

export interface IAuthenticator {
    login(redirectTo?: string): Promise<IEnvironmentAuth>;
    generateAuthToken(token: string): Promise<string>;
    verifyAuthToken(token: string): Promise<void>;
}

export interface IAuthenticatorOptions {
    type: AUTHENTICATOR_TYPES;
    httpOrigin: string;
    isRemote?: boolean;
    authenticationUrl?: string;
    redirectUrl: string;
    verificationUrl?: string;
}

export {googleAuthenticatorFactory, LOCAL_OAUTH_REDIRECT, IGoogleAuthenticatorOptions} from './google.authenticator';
