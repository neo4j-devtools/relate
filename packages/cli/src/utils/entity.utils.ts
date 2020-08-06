import {ENTITY_TYPES, Environment, IDbmsInfo, InvalidArgumentError, IProject} from '@relate/common';

type SelectedEntityReturn = {
    [ENTITY_TYPES.DBMS]: IDbmsInfo;
    [ENTITY_TYPES.PROJECT]: IProject;
    [key: string]: any;
};

export function getSelectedEntity<T extends ENTITY_TYPES>(
    environment: Environment,
    entityType: T,
    entityNameOrId: string,
): Promise<SelectedEntityReturn[T]> {
    switch (entityType) {
        case ENTITY_TYPES.DBMS:
            return environment.dbmss.get(entityNameOrId);

        case ENTITY_TYPES.PROJECT:
            return environment.projects.get(entityNameOrId);

        default:
            throw new InvalidArgumentError(`cannot select entity type ${entityType}`);
    }
}
