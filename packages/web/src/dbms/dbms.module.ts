import {Module} from '@nestjs/common';

import {SystemModule} from '@daedalus/common';
import {DBMSResolver} from './dbms.resolver';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [DBMSResolver],
})
export class DBMSModule {}
