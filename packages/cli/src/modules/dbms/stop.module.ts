import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';

import {SystemModule, SystemProvider} from '@daedalus/common';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StopModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onApplicationBootstrap(): Promise<void> {
        const account = this.systemProvider.getAccount('foo');

        return account
            .stopDbmss(this.parsed.argv)
            .then((res) => {
                this.utils.log(...res);
            })
            .catch(this.utils.error);
    }
}
