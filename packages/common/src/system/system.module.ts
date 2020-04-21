import {DynamicModule, Module} from '@nestjs/common';
import {filter, map} from 'lodash';

import {SystemProvider} from './system.provider';
import {EXTENSION_TYPES} from '../models';
import {INSTALLED_EXTENSIONS} from '../installed-extensions';

const dynamicModules: Promise<DynamicModule>[] = map(
    filter(INSTALLED_EXTENSIONS, ({type}) => type === EXTENSION_TYPES.SYSTEM),
    async ({main}) => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const {default: module} = await require(main);

        return {
            module,
        };
    },
);

@Module({
    exports: [SystemProvider],
    imports: [...dynamicModules],
    providers: [SystemProvider],
})
export class SystemModule {}
