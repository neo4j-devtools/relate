import {PropertiesFile} from '../system/files';

export function getAccessTokenRCKey(environmentId: string, dbmsId: string, dbmsUser: string): string {
    return `//${environmentId}/${dbmsId}/${dbmsUser}/:_accessToken`;
}

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
    knownConnectionsPath: string,
    environmentId: string,
    dbmsId: string,
    dbmsUser: string,
): Promise<string | undefined> {
    const key = getAccessTokenRCKey(environmentId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    return properties.get(key);
}
