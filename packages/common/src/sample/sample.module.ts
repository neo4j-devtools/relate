import {Module} from '@nestjs/common';

import {HelloService, SampleService} from './services';

@Module({
    exports: [HelloService],
    providers: [SampleService, HelloService],
})
export class SampleModule {}
