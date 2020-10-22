import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {Application, Request} from 'express';
import cookieParser from 'cookie-parser';
import _ from 'lodash';
import {
    AUTH_TOKEN_HEADER,
    API_TOKEN_HEADER,
    CLIENT_ID_HEADER,
    SystemProvider,
    AUTHENTICATION_BASE_ENDPOINT,
    AUTHENTICATION_ENDPOINT,
    HEALTH_BASE_ENDPOINT,
    STATIC_APP_BASE_ENDPOINT,
    VALIDATION_ENDPOINT,
    VERIFICATION_ENDPOINT,
} from '@relate/common';

@Injectable()
export class AuthService {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app: Application = httpAdapter.getInstance();

        app.use(cookieParser());
        this.registerAPITokenHandlers(app);
        this.registerAuthenticationHandlers(app);
    }

    registerAPITokenHandlers(app: Application): void {
        app.use(async (req, res, next) => {
            if (_.startsWith(req.path, HEALTH_BASE_ENDPOINT) || _.startsWith(req.path, STATIC_APP_BASE_ENDPOINT)) {
                next();
                return;
            }

            const clientId = getRequestToken(req, CLIENT_ID_HEADER) || '';
            const apiToken = getRequestToken(req, API_TOKEN_HEADER) || '';
            const environment = await this.systemProvider.getEnvironment();

            if (!environment.requiresAPIToken) {
                next();
                return;
            }

            const origin = req.get('origin');
            // Use the client URL otherwise fallback to the Relate server URL.
            // Requests coming from files might contain either 'null' or 'file://' in the Origin header.
            const requestUrl = origin && origin !== 'null' && new URL(origin).host ? origin : environment.httpOrigin;
            const requestHost = new URL(requestUrl).host;

            try {
                await environment.verifyAPIToken(requestHost, clientId, apiToken);
                next();
            } catch (e) {
                res.clearCookie(CLIENT_ID_HEADER);
                res.clearCookie(API_TOKEN_HEADER);
                res.sendStatus(401);
            }
        });

        app.use(async (req, res, next) => {
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
        });
    }

    registerAuthenticationHandlers(app: Application): void {
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
                    res.cookie(AUTH_TOKEN_HEADER, authToken);
                    res.header(AUTH_TOKEN_HEADER, authToken);

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
                const authToken = getRequestToken(req, AUTH_TOKEN_HEADER);
                const environment = await this.systemProvider.getEnvironment();

                try {
                    await environment.verifyAuthToken(authToken);
                    res.sendStatus(200);
                } catch (e) {
                    res.clearCookie(AUTH_TOKEN_HEADER);
                    res.status(403);
                    res.send(e.message);
                }
            },
        );
    }
}

function getRequestToken(req: Request, key: string): string | undefined {
    const lowerCased = key.toLowerCase();

    if (_.has(req.headers, key)) {
        return req.headers[key] as string;
    }

    if (_.has(req.headers, lowerCased)) {
        return req.headers[lowerCased] as string;
    }

    if (_.has(req.cookies, key)) {
        return req.cookies[key] as string;
    }

    if (_.has(req.cookies, lowerCased)) {
        return req.cookies[lowerCased] as string;
    }

    return undefined;
}

function getAuthRedirect(httpOrigin: string, redirectTo: string, authToken: string): string {
    try {
        const {origin} = new URL(redirectTo);

        return origin === httpOrigin ? redirectTo : `${redirectTo}?authToken=${authToken}`;
    } catch (_e) {
        return redirectTo;
    }
}
