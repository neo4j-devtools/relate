import {Module} from '@nestjs/common';

import {SystemProvider} from './system.provider';

@Module({
    exports: [SystemProvider],
    imports: [],
    providers: [SystemProvider],
})
export class SystemModule {}
