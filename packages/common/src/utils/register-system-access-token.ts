import {readPropertiesFile} from './read-properties-file';
import {writePropertiesFile} from './write-properties-file';
import {getAccessTokenRCKey} from './get-access-token-rc-key';

export async function registerSystemAccessToken(
    knownConnectionsPath: string,
    accountId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
) {
    const key = getAccessTokenRCKey(accountId, dbmsId, dbmsUser);
    const properties = await readPropertiesFile(knownConnectionsPath);

    properties.set(key, accessToken);

    return writePropertiesFile(knownConnectionsPath, properties);
}
