import {IRelateBackup} from '../../models';

export function updateRestoredEntityManifest<T extends {id: string; name: string}>(
    backupManifest: IRelateBackup,
    restoredEntityId: string,
    entityManifest: T,
): T {
    return {
        ...entityManifest,
        id: restoredEntityId,
        name: `${entityManifest.name} [From ${backupManifest.created}]`,
    };
}
