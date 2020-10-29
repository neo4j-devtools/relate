import fse from 'fs-extra';
import path from 'path';

import {ENTITY_TYPES} from '../constants';

export function getAccessTokenFileName(environmentNameOrId: string, dbmsId: string, dbmsUser: string): string {
    return `${environmentNameOrId}-${ENTITY_TYPES.DBMS}-${dbmsId}-${dbmsUser}`;
}

export async function registerSystemAccessToken(
    tokenDirPath: string,
    environmentNameOrId: string,
    dbmsId: string,
    dbmsUser: string,
    accessToken: string,
): Promise<void> {
    const fileName = getAccessTokenFileName(environmentNameOrId, dbmsId, dbmsUser);

    await fse.writeFile(path.join(tokenDirPath, fileName), accessToken, 'utf8');
}

export function getSystemAccessToken(
    tokenDirPath: string,
    environmentNameOrId: string,
    dbmsId: string,
    dbmsUser: string,
): Promise<string | undefined> {
    const fileName = getAccessTokenFileName(environmentNameOrId, dbmsId, dbmsUser);

    return fse.readFile(path.join(tokenDirPath, fileName), 'utf8').catch(() => undefined);
}
