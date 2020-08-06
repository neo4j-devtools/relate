import {Module} from '@nestjs/common';

import {SystemModule} from '@relate/common';
import {DbResolver} from './db.resolver';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [DbResolver],
})
export class DBModule {}
