import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import _ from 'lodash';
import {AUTH_TOKEN_HEADER, SystemProvider, AUTHENTICATION_BASE_ENDPOINT, HEALTH_BASE_ENDPOINT} from '@relate/common';
import {getRequestToken} from '../services/auth.service';

@Injectable()
export class AuthTokenMiddleware implements NestMiddleware {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    async use(req: Request, res: Response, next: NextFunction) {
        if (_.startsWith(req.path, AUTHENTICATION_BASE_ENDPOINT) || _.startsWith(req.path, HEALTH_BASE_ENDPOINT)) {
            next();
            return;
        }

        const authToken = getRequestToken(req, AUTH_TOKEN_HEADER);
        const environment = await this.systemProvider.getEnvironment();

        try {
            await environment.verifyAuthToken(authToken);
            next();
        } catch (e) {
            res.clearCookie(AUTH_TOKEN_HEADER);

            if (req.method !== 'GET') {
                res.sendStatus(401);
                return;
            }

            const {authUrl} = await environment.login(req.url);

            res.redirect(authUrl);
        }
    }
}
