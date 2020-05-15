import {LAUNCH_TOKEN_PARAMETER} from './apps.constants';

export function createAppLaunchUrl(appUrl: string, launchToken?: string) {
    return launchToken ? `${appUrl}?${LAUNCH_TOKEN_PARAMETER}=${launchToken}` : appUrl;
}
