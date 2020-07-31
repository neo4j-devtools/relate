import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {Application, Request} from 'express';
import cookieParser from 'cookie-parser';
import _ from 'lodash';
import {
    AUTH_TOKEN_KEY,
    SystemProvider,
    AUTHENTICATION_BASE_ENDPOINT,
    AUTHENTICATION_ENDPOINT,
    HEALTH_BASE_ENDPOINT,
    VALIDATION_ENDPOINT,
    VERIFICATION_ENDPOINT,
} from '@relate/common';

const getRequestAuthToken = (req: Request): string | undefined => {
    const lowerCased = AUTH_TOKEN_KEY.toLowerCase();

    if (_.has(req.headers, AUTH_TOKEN_KEY)) {
        return req.headers[AUTH_TOKEN_KEY] as string;
    }

    if (_.has(req.headers, lowerCased)) {
        return req.headers[lowerCased] as string;
    }

    if (_.has(req.cookies, AUTH_TOKEN_KEY)) {
        return req.cookies[AUTH_TOKEN_KEY];
    }

    return undefined;
};

@Injectable()
export class AuthService {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app: Application = httpAdapter.getInstance();

        app.use(cookieParser());
        app.use(async (req, res, next) => {
            if (_.startsWith(req.path, AUTHENTICATION_BASE_ENDPOINT) || _.startsWith(req.path, HEALTH_BASE_ENDPOINT)) {
                next();
                return;
            }

            const authToken = getRequestAuthToken(req);
            const environment = await this.systemProvider.getEnvironment();

            try {
                await environment.verifyAuthToken(authToken);
                next();
            } catch (e) {
                res.clearCookie(AUTH_TOKEN_KEY);

                if (req.method !== 'GET') {
                    res.sendStatus(401);
                    return;
                }

                const {authUrl} = await environment.login(req.url);

                res.redirect(authUrl);
            }
        });

        app.get(
            AUTHENTICATION_ENDPOINT,
            async (req, res): Promise<void> => {
                const environment = await this.systemProvider.getEnvironment();
                const {redirectTo} = req.query;

                try {
                    const {authUrl} = await environment.login(redirectTo);

                    res.redirect(authUrl);
                } catch (e) {
                    res.status(403);
                    res.send(e.message);
                }
            },
        );

        app.get(
            VALIDATION_ENDPOINT,
            async (req, res): Promise<void> => {
                const queryObject = req.query;

                if (queryObject.error) {
                    res.status(401);
                    res.send(`Login failed: ${queryObject.error}`);
                    return;
                }

                try {
                    const environment = await this.systemProvider.getEnvironment();
                    const authToken = await environment.generateAuthToken(queryObject);

                    // @todo: use signed cookies
                    res.cookie(AUTH_TOKEN_KEY, authToken);
                    res.header(AUTH_TOKEN_KEY, authToken);

                    // @todo: this is Google OAuth specific
                    if (queryObject.state) {
                        res.redirect(getAuthRedirect(environment.httpOrigin, queryObject.state, authToken));
                        return;
                    }

                    res.status(201);
                    res.send('You are authenticated, you can close this tab now.');
                } catch (e) {
                    res.status(403);
                    res.send(e.message);
                }
            },
        );

        app.get(
            VERIFICATION_ENDPOINT,
            async (req, res): Promise<void> => {
                const authToken = getRequestAuthToken(req);
                const environment = await this.systemProvider.getEnvironment();

                try {
                    await environment.verifyAuthToken(authToken);
                    res.sendStatus(200);
                } catch (e) {
                    res.status(403);
                    res.send(e.message);
                }
            },
        );
    }
}

function getAuthRedirect(httpOrigin: string, redirectTo: string, authToken: string): string {
    try {
        const {origin} = new URL(redirectTo);

        return origin === httpOrigin ? redirectTo : `${redirectTo}?authToken=${authToken}`;
    } catch (_e) {
        return redirectTo;
    }
}
