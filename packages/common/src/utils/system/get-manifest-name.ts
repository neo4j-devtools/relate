import {DBMS_MANIFEST_FILE, ENTITY_TYPES, EXTENSION_MANIFEST_FILE, PROJECT_MANIFEST_FILE} from '../../constants';
import {InvalidArgumentError} from '../../errors';

export function getManifestName(entityType: ENTITY_TYPES): string {
    switch (entityType) {
        case ENTITY_TYPES.DBMS:
            return DBMS_MANIFEST_FILE;

        case ENTITY_TYPES.PROJECT:
            return PROJECT_MANIFEST_FILE;

        case ENTITY_TYPES.EXTENSION:
            return EXTENSION_MANIFEST_FILE;

        default:
            throw new InvalidArgumentError(`Entity type ${entityType} does not have a manifest file`);
    }
}
