import {OnModuleInit, Module, Inject} from '@nestjs/common';

import {SystemModule, SystemProvider} from '@daedalus/common';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StartModule implements OnModuleInit {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onModuleInit(): void {
        const account = this.systemProvider.getAccount('foo');
        account.startDBMS(this.parsed.args.dbmsID).catch((err: Error) => this.utils.error(err, {exit: false}));
    }
}
