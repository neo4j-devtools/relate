import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import UninstallCommand from '../../commands/dbms/uninstall';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UninstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof UninstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        let {dbms} = args;

        if (!dbms) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to uninstall', environment);
                dbms = selectedDbms;
            } else {
                dbms = await readStdin();
            }
        }

        return environment.dbmss.uninstall(dbms).then(() => {
            this.utils.log(dbms);
        });
    }
}
