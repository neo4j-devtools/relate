import {DynamicModule} from '@nestjs/common';
import {filter, map} from 'lodash';

import {EXTENSION_TYPES} from '../models';
import {INSTALLED_EXTENSIONS} from '../constants';
import {InvalidArgumentError} from '../errors';

export function loadExtensionsFor(targetType: EXTENSION_TYPES): Promise<DynamicModule>[] {
    if (targetType === EXTENSION_TYPES.STATIC) {
        throw new InvalidArgumentError('STATIC extensions are not modules');
    }

    return map(
        filter(INSTALLED_EXTENSIONS, ({type}) => type === targetType),
        async ({main}) => {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const {default: module} = await require(main);

            return {
                module,
            };
        },
    );
}
