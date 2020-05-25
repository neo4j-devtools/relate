import {Inject, Injectable} from '@nestjs/common';
import {AbstractHttpAdapter} from '@nestjs/core';
import {ConfigService} from '@nestjs/config';
import {AUTH_TOKEN_KEY, SystemProvider} from '@relate/common';
import {Application} from 'express';
import cookieParser from 'cookie-parser';
import _ from 'lodash';

import {IWebModuleConfig} from '../../web.module';

@Injectable()
export class AuthService {
    static AUTHENTICATION_ENDPOINT = '/authenticate';

    static REDIRECT_ENDPOINT = '/validate';

    static VERIFICATION_ENDPOINT = '/verify';

    get healthUrl(): string {
        const protocol = this.configService.get('protocol');
        const host = this.configService.get('host');
        const port = this.configService.get('port');
        const authenticationEndpoint = this.configService.get('authenticationEndpoint');

        return `${protocol}${host}:${port}${authenticationEndpoint}`;
    }

    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService<IWebModuleConfig>,
        @Inject(SystemProvider) private readonly systemProvider: SystemProvider,
    ) {}

    register(httpAdapter: AbstractHttpAdapter): void {
        if (!httpAdapter) {
            return;
        }

        const app: Application = httpAdapter.getInstance();
        const authenticationEndpoint = this.configService.get('authenticationEndpoint');

        app.use(cookieParser());
        app.use(async (req, res, next) => {
            if (_.startsWith(req.path, authenticationEndpoint)) {
                next();
                return;
            }

            const token =
                req.headers[AUTH_TOKEN_KEY] || req.headers[AUTH_TOKEN_KEY.toLowerCase()] || req.cookies[AUTH_TOKEN_KEY];
            const environment = await this.systemProvider.getEnvironment();

            try {
                await environment.verifyAuthToken(token);
                next();
            } catch (e) {
                res.clearCookie(AUTH_TOKEN_KEY);
                res.redirect(`${authenticationEndpoint}${AuthService.AUTHENTICATION_ENDPOINT}?redirectTo=${req.url}`);
            }
        });

        app.get(
            `${authenticationEndpoint}${AuthService.AUTHENTICATION_ENDPOINT}`,
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
            `${authenticationEndpoint}${AuthService.REDIRECT_ENDPOINT}`,
            async (req, res): Promise<void> => {
                const queryObject = req.query;
                // @todo: this is Google OAuth specific
                const {state} = queryObject;

                if (queryObject.error) {
                    res.status(401);
                    res.send(`Login failed: ${queryObject.error}`);
                    return;
                }

                try {
                    const environment = await this.systemProvider.getEnvironment();
                    const authToken = await environment.generateAuthToken(queryObject.code);

                    // @todo: use signed cookies
                    res.cookie(AUTH_TOKEN_KEY, authToken);
                    res.header(AUTH_TOKEN_KEY, authToken);

                    if (state) {
                        res.redirect(`${state}?authToken=${authToken}`);
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
            `${authenticationEndpoint}${AuthService.VERIFICATION_ENDPOINT}`,
            async (req, res): Promise<void> => {
                const token = req.cookies[AUTH_TOKEN_KEY];
                const environment = await this.systemProvider.getEnvironment();

                try {
                    await environment.verifyAuthToken(token);
                    res.sendStatus(200);
                } catch (e) {
                    res.status(403);
                    res.send(e.message);
                }
            },
        );
    }
}
