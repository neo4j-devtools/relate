import {APP_LAUNCH_DATA_RESOLVER} from './constants';

type GraphQLQuery = {
    operationName: string;
    variables: {[key: string]: any};
    query: string;
};

export function getParseLaunchTokenPayload(appName: string, launchToken: string): GraphQLQuery {
    const operationName = 'launchData';

    return {
        operationName,
        query: `
          query ${operationName}(appName: String!, $launchToken: String!) {
            ${APP_LAUNCH_DATA_RESOLVER}(appName: appName, launchToken: $launchToken) {
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
            appName,
            launchToken,
        },
    };
}
