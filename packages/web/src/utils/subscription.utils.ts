import {UnauthorizedException} from '@nestjs/common';
import {API_TOKEN_HEADER, CLIENT_ID_HEADER, SystemProvider} from '@relate/common';
import {Str} from '@relate/types';
import {Context} from 'graphql-ws';

interface IGraphQLSubscriptionTransportWsConfig {
    onConnect: (connectionParams: Readonly<Record<string, unknown>>, ws: WebSocket) => Promise<boolean>;
}

export function subscriptionsTransportWs(systemProvider: SystemProvider): IGraphQLSubscriptionTransportWsConfig {
    return {
        async onConnect(connectionParams: Readonly<Record<string, unknown>>, ws: WebSocket) {
            const clientId = Str.from(connectionParams[CLIENT_ID_HEADER]).toString();
            const apiToken = Str.from(connectionParams[API_TOKEN_HEADER]).toString();
            const environment = await systemProvider.getEnvironment();

            if (!environment.requiresAPIToken) {
                return true;
            }

            // @ts-ignore ws contains the upgradeReq attribute,
            // but the type definition for it doesn't.
            const origin = ws.upgradeReq.headers?.origin || 'null';
            // Use the client URL otherwise fallback to the
            // Relate server URL. Requests coming from files
            // might contain either 'null' or 'file://' in the
            // Origin header.
            const requestUrl = origin && origin !== 'null' && new URL(origin).host ? origin : environment.httpOrigin;
            const requestHost = new URL(requestUrl).host;

            try {
                await environment.verifyAPIToken(requestHost, clientId, apiToken);
                return true;
            } catch (e) {
                throw new UnauthorizedException();
            }
        },
    };
}

interface IGraphQLWsSubscriptionsConfig {
    onConnect: (context: Context<unknown>) => Promise<boolean>;
}

export function graphqlWs(systemProvider: SystemProvider): IGraphQLWsSubscriptionsConfig {
    return {
        async onConnect(context: Context<unknown>) {
            const {connectionParams = {}, extra} = context;

            const clientId = Str.from(connectionParams[CLIENT_ID_HEADER]).toString();
            const apiToken = Str.from(connectionParams[API_TOKEN_HEADER]).toString();
            const environment = await systemProvider.getEnvironment();

            if (!environment.requiresAPIToken) {
                return true;
            }

            // @ts-ignore ws contains the upgradeReq attribute,
            // but the type definition for it doesn't.
            const origin = extra.request.headers?.origin || 'null';
            // Use the client URL otherwise fallback to the
            // Relate server URL. Requests coming from files
            // might contain either 'null' or 'file://' in the
            // Origin header.
            const requestUrl = origin && origin !== 'null' && new URL(origin).host ? origin : environment.httpOrigin;
            const requestHost = new URL(requestUrl).host;

            try {
                await environment.verifyAPIToken(requestHost, clientId, apiToken);
                return true;
            } catch (e) {
                throw new UnauthorizedException();
            }
        },
    };
}
