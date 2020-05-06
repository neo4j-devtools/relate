import {APP_LAUNCH_DATA_RESOLVER} from './constants';

type GraphQLQuery = {
    operationName: string;
    variables: {[key: string]: any};
    query: string;
};

export function getParseLaunchTokenPayload(appId: string, launchToken: string): GraphQLQuery {
    const operationName = 'launchData';

    return {
        operationName,
        query: `
          query ${operationName}($appId: String!, $launchToken: String!) {
            ${APP_LAUNCH_DATA_RESOLVER}(appId: $appId, launchToken: $launchToken) {
              accessToken
              dbms {
                id
                name
                connectionUri
              }
              principal
            }
          }
        `,
        variables: {
            appId,
            launchToken,
        },
    };
}
