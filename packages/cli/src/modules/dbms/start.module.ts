import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {prompt} from 'enquirer';

import {SystemModule, SystemProvider} from '@relate/common';
import {readStdinArray, isTTY} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StartModule implements OnApplicationBootstrap {
    static DEFAULT_ACCOUNT_ID = 'foo';

    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const account = this.systemProvider.getAccount(StartModule.DEFAULT_ACCOUNT_ID);
        let dbmsIds = this.parsed.argv;

        if (!dbmsIds.length) {
            if (isTTY()) {
                const dbmss = await account.listDbmss();

                const {selectedDbms} = await prompt({
                    choices: dbmss.map((dbms) => ({
                        name: dbms,
                        value: dbms,
                    })),
                    message: 'Select a DBMS',
                    name: 'selectedDbms',
                    type: 'select',
                });

                dbmsIds = [selectedDbms];
            } else {
                dbmsIds = await readStdinArray();
            }
        }

        return account
            .startDbmss(dbmsIds)
            .then((res) => {
                this.utils.log(...res);
            })
            .catch(this.utils.error);
    }
}
