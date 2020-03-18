import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider} from '@relate/common';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onApplicationBootstrap(): Promise<void> {
        const account = this.systemProvider.getAccount('foo');

        return account
            .listDbmss()
            .then((dbmss) => {
                cli.table(
                    dbmss,
                    {
                        id: {},
                        name: {},
                        description: {},
                    },
                    {
                        printLine: this.utils.log,
                        ...this.parsed.flags,
                    },
                );
            })
            .catch(this.utils.error);
    }
}
