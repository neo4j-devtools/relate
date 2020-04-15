import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {prompt} from 'enquirer';
import {SystemModule, SystemProvider} from '@relate/common';

import {readStdinArray, isTTY} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UninstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const account = this.systemProvider.getAccount(flags.account);
        let {dbmsId} = args;

        if (!dbmsId) {
            if (isTTY()) {
                const dbmss = await account.listDbmss();

                const {selectedDbms} = await prompt({
                    choices: dbmss.map((dbms) => ({
                        message: `[${dbms.id}] ${dbms.name}`,
                        name: dbms.id,
                    })),
                    message: 'Select a DBMS',
                    name: 'selectedDbms',
                    type: 'select',
                });

                dbmsId = selectedDbms;
            } else {
                dbmsId = (await readStdinArray()).join('');
            }
        }

        return account
            .uninstallDbms(dbmsId)
            .then(() => {
                this.utils.log(dbmsId);
            })
            .catch(this.utils.error);
    }
}
