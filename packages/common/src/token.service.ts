import jwt, {SignOptions} from 'jsonwebtoken';
import path from 'path';
import fse from 'fs-extra';
import {v4 as uuidv4} from 'uuid';
import _ from 'lodash';

import {DEFAULT_JWT_SIGN_OPTIONS, RELATE_TOKEN_SALT_FILE_NAME} from './constants';
import {InvalidArgumentError, ValidationFailureError} from './errors';
import {envPaths} from './utils/env-paths';

// @todo: find a better home
export abstract class TokenService {
    static INSTANCE_SALT_PATH = path.join(envPaths().data, RELATE_TOKEN_SALT_FILE_NAME);

    static UUID_V4_REGEX = /^[a-z0-9]{8}-[a-z0-9]{4}-4[a-z0-9]{3}-[a-z0-9]{4}-[a-z0-9]{12}$/;

    static async sign(data: any, salt = '', options: SignOptions = {}): Promise<string> {
        const instanceSalt = await TokenService.getInstanceSalt();
        const jwtTokenSalt = `${instanceSalt}-${salt}`;
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

    static async verify<T = any>(token: string, salt = ''): Promise<T> {
        const instanceSalt = await TokenService.getInstanceSalt();
        const jwtTokenSalt = `${instanceSalt}-${salt}`;

        return new Promise((resolve, reject) => {
            jwt.verify(token, jwtTokenSalt, (err: any, decoded: any) => {
                if (err || !decoded) {
                    reject(new ValidationFailureError(err ? err.message : 'Failed to decode token'));
                    return;
                }

                resolve(decoded);
            });
        });
    }

    static async getInstanceSalt() {
        try {
            const salt = await fse.readFile(TokenService.INSTANCE_SALT_PATH, 'utf8');

            if (!TokenService.UUID_V4_REGEX.test(salt)) {
                throw new InvalidArgumentError(`Invalid secret key provided`);
            }

            return salt;
        } catch (_e) {
            const salt = uuidv4();

            await fse.writeFile(TokenService.INSTANCE_SALT_PATH, salt, 'utf8');

            return salt;
        }
    }
}
