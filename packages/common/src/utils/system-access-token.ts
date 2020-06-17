import {PropertiesFile} from '../system/files';

export function getAccessTokenRCKey(environmentNameOrId: string, dbmsId: string, dbmsUser: string): string {
    return `//${environmentNameOrId}/${dbmsId}/${dbmsUser}/:_accessToken`;
}

export async function registerSystemAccessToken(
    knownConnectionsPath: string,
    environmentNameOrId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
): Promise<void> {
    const key = getAccessTokenRCKey(environmentNameOrId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    properties.set(key, accessToken);

    return properties.flush();
}

export async function getSystemAccessToken(
    knownConnectionsPath: string,
    environmentNameOrId: string,
    dbmsId: string,
    dbmsUser: string,
): Promise<string | undefined> {
    const key = getAccessTokenRCKey(environmentNameOrId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    return properties.get(key);
}
