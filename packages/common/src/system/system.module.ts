import {Module} from '@nestjs/common';

import {SystemProvider} from './system.provider';
import {loadExtensionsFor} from '../utils/extensions';
import {EXTENSION_TYPES} from '../constants';

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.SYSTEM);

@Module({
    exports: [SystemProvider],
    imports: [...dynamicModules],
    providers: [SystemProvider],
})
export class SystemModule {}
