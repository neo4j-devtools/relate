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
        let {dbmsId} = args;

        if (!dbmsId) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to uninstall', environment);
                dbmsId = selectedDbms;
            } else {
                dbmsId = await readStdin();
            }
        }

        return environment.uninstallDbms(dbmsId).then(() => {
            this.utils.log(dbmsId);
        });
    }
}
