import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {Application, Request} from 'express';
import _ from 'lodash';
import {
    AUTH_TOKEN_HEADER,
    SystemProvider,
    AUTHENTICATION_ENDPOINT,
    VALIDATION_ENDPOINT,
    VERIFICATION_ENDPOINT,
} from '@relate/common';
import {Str} from '@relate/types';

@Injectable()
export class AuthService {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app: Application = httpAdapter.getInstance();

        this.registerAuthenticationHandlers(app);
    }

    registerAuthenticationHandlers(app: Application): void {
        app.get(AUTHENTICATION_ENDPOINT, async (req, res): Promise<void> => {
            const environment = await this.systemProvider.getEnvironment();
            const redirectTo = Str.from(req.query.redirectTo).toString();

            try {
                const {authUrl} = await environment.login(redirectTo);

                res.redirect(authUrl);
            } catch (e) {
                res.status(403);
                res.send(e.message);
            }
        });

        app.get(VALIDATION_ENDPOINT, async (req, res): Promise<void> => {
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
                    const state = Str.from(queryObject.state).toString();
                    res.redirect(getAuthRedirect(environment.httpOrigin, state, authToken));
                    return;
                }

                res.status(201);
                res.send('You are authenticated, you can close this tab now.');
            } catch (e) {
                res.status(403);
                res.send(e.message);
            }
        });

        app.get(VERIFICATION_ENDPOINT, async (req, res): Promise<void> => {
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
        });
    }
}

export function getRequestToken(req: Request, key: string): string | undefined {
    const lowerCased = key.toLowerCase();

    if (_.has(req.headers, key)) {
        return `${req.headers[key]}`;
    }

    if (_.has(req.headers, lowerCased)) {
        return `${req.headers[lowerCased]}`;
    }

    if (_.has(req.cookies, key)) {
        return `${req.cookies[key]}`;
    }

    if (_.has(req.cookies, lowerCased)) {
        return `${req.cookies[lowerCased]}`;
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
