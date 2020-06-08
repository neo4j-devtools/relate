import {IEnvironmentAuth} from '../../../models';
import {AUTHENTICATOR_TYPES} from './authenticators.constants';

export interface IAuthenticator {
    login(redirectTo?: string): Promise<IEnvironmentAuth>;
    generateAuthToken(token: string): Promise<string>;
    verifyAuthToken(token: string): Promise<void>;
}

export interface IAuthenticatorOptions {
    type: AUTHENTICATOR_TYPES;
    httpOrigin: string;
    authenticationUrl?: string;
    redirectUrl: string;
    verificationUrl?: string;
}
