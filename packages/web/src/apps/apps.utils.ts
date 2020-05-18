import {LAUNCH_TOKEN_PARAMETER} from './apps.constants';

export function createAppLaunchUrl(staticRoot: string, appId: string, launchToken?: string): string {
    return launchToken ? `${staticRoot}/${appId}?${LAUNCH_TOKEN_PARAMETER}=${launchToken}` : `${staticRoot}/${appId}`;
}
