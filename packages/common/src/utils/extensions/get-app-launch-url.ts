import {EnvironmentAbstract} from '../../entities/environments';
import {isValidUrl} from '../generic';
import {RELATE_API_TOKEN_PARAM_NAME, RELATE_LAUNCH_TOKEN_PARAM_NAME, RELATE_URL_PARAM_NAME} from '../../constants';

export async function getAppLaunchUrl(
    environment: EnvironmentAbstract,
    appPath: string,
    clientId: string,
    launchToken?: string,
): Promise<string> {
    const asURL = isValidUrl(appPath) ? new URL(appPath) : new URL(`${environment.httpOrigin}${appPath}`);

    if (asURL.origin !== environment.httpOrigin) {
        asURL.searchParams.set(RELATE_URL_PARAM_NAME, environment.httpOrigin);
    }

    if (environment.requiresAPIToken) {
        asURL.searchParams.set(
            RELATE_API_TOKEN_PARAM_NAME,
            await environment.generateAPIToken(asURL.host, clientId, {}),
        );
    }

    if (launchToken) {
        asURL.searchParams.set(RELATE_LAUNCH_TOKEN_PARAM_NAME, launchToken);
    }

    return `${asURL}`;
}
