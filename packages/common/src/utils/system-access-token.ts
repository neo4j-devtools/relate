import {getAccessTokenRCKey} from './get-access-token-rc-key';
import {PropertiesFile} from '../system';

export async function registerSystemAccessToken(
    knownConnectionsPath: string,
    environmentId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
): Promise<void> {
    const key = getAccessTokenRCKey(environmentId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    properties.set(key, accessToken);

    return properties.flush();
}

export async function getSystemAccessToken(
    rcPath: string,
    environmentId: string,
    dbmsId: string,
    dbmsUser: string,
): Promise<string | undefined> {
    const key = getAccessTokenRCKey(environmentId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(rcPath);

    return properties.get(key);
}
