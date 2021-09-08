import {Module} from '@nestjs/common';

import {SystemModule} from '@relate/common';
import {DBMSPluginsResolver} from './dbms-plugins.resolver';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [DBMSPluginsResolver],
})
export class DBMSPluginsModule {}
