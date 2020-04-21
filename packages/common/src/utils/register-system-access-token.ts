import {getAccessTokenRCKey} from './get-access-token-rc-key';
import {PropertiesFile} from '../system';

export async function registerSystemAccessToken(
    knownConnectionsPath: string,
    accountId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
): Promise<void> {
    const key = getAccessTokenRCKey(accountId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    properties.set(key, accessToken);

    return properties.flush();
}
