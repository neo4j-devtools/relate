import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import InstallCommand from '../../commands/dbms/install';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {name} = args;
        const {account: accountId, credentials, version} = flags;
        const account = this.systemProvider.getAccount(accountId);

        if (!name || !credentials || !version) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Not yet implemented`);
        }

        return account
            .installDbms(name, credentials, version)
            .then((res) => {
                this.utils.log(res);
            })
            .catch(this.utils.error);
    }
}
