import {getAccessTokenRCKey} from './get-access-token-rc-key';
import {PropertiesFile} from '../system/files';

export async function getSystemAccessToken(
    knownConnectionsPath: string,
    accountId: string,
    dbmsId: string,
    dbmsUser: string,
): Promise<string | undefined> {
    const key = getAccessTokenRCKey(accountId, dbmsId, dbmsUser);
    const properties = await PropertiesFile.readFile(knownConnectionsPath);

    return properties.get(key);
}
