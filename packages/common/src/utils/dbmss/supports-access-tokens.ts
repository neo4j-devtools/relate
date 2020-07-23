import semver from 'semver';

import {NEO4J_ACCESS_TOKENS_SUPPORTED_VERSION_RANGE, NEO4J_EDITION} from '../../entities/environments';

export function supportsAccessTokens(dbms: {version?: string; edition?: NEO4J_EDITION}): boolean {
    return (
        dbms.edition === NEO4J_EDITION.ENTERPRISE &&
        semver.satisfies(dbms.version || '', NEO4J_ACCESS_TOKENS_SUPPORTED_VERSION_RANGE)
    );
}
