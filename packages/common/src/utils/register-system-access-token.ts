import {readPropertiesFile} from './read-properties-file';
import {writePropertiesFile} from './write-properties-file';

export async function registerSystemAccessToken(
    rcPath: string,
    accountId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
) {
    const key = `//${accountId}/${dbmsId}/${dbmsUser}/:_accessToken`;
    const properties = await readPropertiesFile(rcPath);

    properties.set(key, accessToken);

    return writePropertiesFile(rcPath, properties);
}
