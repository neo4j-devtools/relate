import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';

import {SystemModule, SystemProvider} from '@relate/common';
import {RequiredArgsError} from '../../errors';
import {readStdin, isTTY} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StopModule implements OnApplicationBootstrap {
    static DEFAULT_ACCOUNT_ID = 'foo';

    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const account = this.systemProvider.getAccount(StopModule.DEFAULT_ACCOUNT_ID);
        let dbmsIds = this.parsed.argv;

        if (!dbmsIds.length) {
            if (isTTY()) {
                // TODO - Once we have dbms:list we can make the user choose
                // the DBMS interactively.
                throw new RequiredArgsError(['dbmsIds']);
            } else {
                dbmsIds = await readStdin().then((raw) => raw.trim().split(/\n|\s/));
            }
        }

        return account
            .stopDbmss(dbmsIds)
            .then((res) => {
                this.utils.log(...res);
            })
            .catch(this.utils.error);
    }
}
