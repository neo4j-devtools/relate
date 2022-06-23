import {Inject, Injectable, NestMiddleware} from '@nestjs/common';
import {NextFunction, Request, Response} from 'express';
import _ from 'lodash';
import {
    SystemProvider,
    HEALTH_BASE_ENDPOINT,
    CLIENT_ID_HEADER,
    API_TOKEN_HEADER,
    STATIC_APP_BASE_ENDPOINT,
} from '@relate/common';

@Injectable()
export class ApiTokenMiddleware implements NestMiddleware {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    async use(req: Request, res: Response, next: NextFunction) {
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
    }
}

function getRequestToken(req: Request, key: string): string | undefined {
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
