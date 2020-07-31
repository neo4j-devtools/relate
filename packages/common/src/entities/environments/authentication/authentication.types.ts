import {IEnvironmentAuth} from '../../../models';
import {AUTHENTICATOR_TYPES} from './authentication.constants';

export interface IAuthentication {
    login(redirectTo?: string): Promise<IEnvironmentAuth>;

    generateAuthToken(data: any): Promise<string>;

    verifyAuthToken(token: string): Promise<void>;
}

export interface IAuthenticationOptions {
    type: AUTHENTICATOR_TYPES;
}
