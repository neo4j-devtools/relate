import {Module} from '@nestjs/common';
import {SampleModule} from '@daedalus/common';

import {HelloResolver} from './hello.resolver';

@Module({
    exports: [],
    imports: [SampleModule],
    providers: [HelloResolver],
})
export class HelloModule {}
