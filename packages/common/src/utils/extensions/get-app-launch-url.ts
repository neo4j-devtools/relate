import {EnvironmentAbstract} from '../../entities/environments';
import {isValidUrl} from '../generic';

export async function getAppLaunchUrl(
    environment: EnvironmentAbstract,
    appPath: string,
    clientId: string,
    launchToken?: string,
): Promise<string> {
    const asURL = isValidUrl(appPath) ? new URL(appPath) : new URL(`${environment.httpOrigin}${appPath}`);

    if (asURL.origin !== environment.httpOrigin) {
        asURL.searchParams.set('relateUrl', environment.httpOrigin);
    }

    if (environment.requiresAPIToken) {
        asURL.searchParams.set('relateApiToken', await environment.generateAPIToken(asURL.host, clientId, {}));
    }

    if (launchToken) {
        asURL.searchParams.set('relateLaunchToken', launchToken);
    }

    return `${asURL}`;
}
