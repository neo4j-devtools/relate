import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {readStdinArray, isInteractive} from '../../stdin';
import StartCommand from '../../commands/dbms/start';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StartModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof StartCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        let dbmsIds = this.parsed.argv;

        if (!dbmsIds.length) {
            if (isInteractive()) {
                const dbmss = await environment.listDbmss();
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to start', dbmss);
                dbmsIds = [selectedDbms];
            } else {
                dbmsIds = await readStdinArray();
            }
        }

        return environment.startDbmss(dbmsIds).then((res) => {
            this.utils.log(...res);
        });
    }
}
