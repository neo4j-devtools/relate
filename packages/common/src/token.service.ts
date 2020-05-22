import jwt, {SignOptions} from 'jsonwebtoken';
import _ from 'lodash';

import {DEFAULT_JWT_SIGN_OPTIONS, JWT_INSTANCE_TOKEN_SALT} from './constants';
import {ValidationFailureError} from './errors';

// @todo: find a better home
export class TokenService {
    static sign(data: any, salt = '', options: SignOptions = {}): Promise<string> {
        const jwtTokenSalt = `${JWT_INSTANCE_TOKEN_SALT}-${salt}`;
        const optionsToUse = _.merge({}, DEFAULT_JWT_SIGN_OPTIONS, options);

        return new Promise((resolve, reject) => {
            jwt.sign(data, jwtTokenSalt, optionsToUse, (err, token) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(token);
            });
        });
    }

    static verify<T = any>(token: string, salt = ''): Promise<T> {
        const jwtTokenSalt = `${JWT_INSTANCE_TOKEN_SALT}-${salt}`;

        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtTokenSalt, (err: any, decoded: any) => {
                if (err) {
                    reject(new ValidationFailureError('Failed to decode App Launch Token'));
                    return;
                }

                resolve(decoded);
            });
        });
    }

    static verifySync<T = any>(token: string, salt = ''): T {
        const jwtTokenSalt = `${JWT_INSTANCE_TOKEN_SALT}-${salt}`;

        return jwt.verify(token, jwtTokenSalt) as any;
    }
}
