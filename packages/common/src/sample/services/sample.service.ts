import {Inject, Injectable, OnApplicationBootstrap} from '@nestjs/common';

import {HelloService} from './hello.service';

@Injectable()
export class SampleService implements OnApplicationBootstrap {
    constructor(@Inject(HelloService) private readonly helloService: HelloService) {}

    onApplicationBootstrap(): void {
        // eslint-disable-next-line no-console
        console.log(this.helloService.getHello());
    }
}
