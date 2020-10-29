import {APP_LAUNCH_DATA_RESOLVER} from './constants';

type GraphQLQuery = {
    operationName: string;
    variables: {[key: string]: any};
    query: string;
};

type RelateURLParams = {
    relateUrl: string | null;
    relateLaunchToken: string | null;
    relateApiToken: string | null;
};

export function getURLParameters(url: string): RelateURLParams {
    const queryParam = new URL(url).searchParams;

    return {
        relateUrl: queryParam.get('relateUrl'),
        relateLaunchToken: queryParam.get('relateLaunchToken'),
        relateApiToken: queryParam.get('relateApiToken'),
    };
}

export function getParseLaunchTokenPayload(appName: string, launchToken: string): GraphQLQuery {
    const operationName = 'launchData';

    return {
        operationName,
        query: `
          query ${operationName}($appName: String!, $launchToken: String!) {
            ${APP_LAUNCH_DATA_RESOLVER}(appName: $appName, launchToken: $launchToken) {
              accessToken
              dbms {
                id
                name
                connectionUri
              }
              principal
              project {
                name
              }
          }
        `,
        variables: {
            appName,
            launchToken,
        },
    };
}
