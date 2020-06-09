import {IDbms} from '../../models';
import {NotFoundError, AmbiguousTargetError} from '../../errors';

export function resolveDbms(dbmss: {[uuid: string]: IDbms}, nameOrId: string): IDbms {
    if (dbmss[nameOrId]) {
        return dbmss[nameOrId];
    }

    const dbmssWithTargetName = Object.values(dbmss).filter((dbms) => dbms.name === nameOrId);

    if (dbmssWithTargetName.length === 0) {
        throw new NotFoundError(`DBMS "${nameOrId}" not found`);
    }

    if (dbmssWithTargetName.length > 1) {
        const ids = dbmssWithTargetName.map((dbms) => dbms.id).join('\n');
        throw new AmbiguousTargetError(`Multiple DBMSs found with name "${nameOrId}": \n${ids}`);
    }

    return dbmssWithTargetName[0];
}
