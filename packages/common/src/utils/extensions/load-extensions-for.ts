import {DynamicModule} from '@nestjs/common';
import {List} from '@relate/types';
import path from 'path';

import {getInstalledExtensionsSync} from './get-installed-extensions';
import {InvalidArgumentError} from '../../errors';
import {EXTENSION_TYPES} from '../../constants';

export function loadExtensionsFor(targetType: EXTENSION_TYPES, nameOrId?: string): List<Promise<DynamicModule>> {
    if (targetType === EXTENSION_TYPES.STATIC) {
        throw new InvalidArgumentError(`${EXTENSION_TYPES.STATIC} extensions are not modules`);
    }

    try {
        return getInstalledExtensionsSync(nameOrId)
            .filter(({type}) => type === targetType)
            .mapEach(async ({root, main}) => {
                // eslint-disable-next-line @typescript-eslint/no-var-requires
                const {default: module} = await require(path.join(root, main));

                return {
                    module,
                };
            });
    } catch (error) {
        return List.from([]);
    }
}
