import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {SystemModule, SystemProvider} from '@relate/common';

import {readStdinArray, isTTY} from '../../stdin';
import StatusCommand from '../../commands/dbms/status';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StatusModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof StatusCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const account = await this.systemProvider.getAccount(flags.account);
        const dbmss = await account.listDbmss();
        let dbmsIds = this.parsed.argv;

        if (!dbmsIds.length) {
            if (isTTY()) {
                dbmsIds = dbmss.map((dbms) => dbms.id);
            } else {
                const stdinDbmss = await readStdinArray();
                dbmsIds = stdinDbmss;
            }
        }

        return account.statusDbmss(dbmsIds).then((res: string[]) => {
            const table = res.map((status, index) => {
                const dbms = dbmss.find((d) => d.id === dbmsIds[index]) || {
                    id: '',
                    name: '',
                };

                return {
                    id: dbms.id,
                    name: dbms.name,
                    status: status.trim(),
                };
            });

            cli.table(
                table,
                {
                    id: {},
                    name: {},
                    status: {},
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
