import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {readStdinArray, isInteractive} from '../../stdin';
import StartCommand from '../../commands/dbms/start';
import {selectDbmsPrompt} from '../../prompts';
import {DBMS_STATUS_FILTERS} from '../../constants';

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
        let dbmss = this.parsed.argv;

        if (!dbmss.length) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt(
                    'Select a DBMS to start',
                    environment,
                    DBMS_STATUS_FILTERS.START,
                );
                dbmss = [selectedDbms];
            } else {
                dbmss = await readStdinArray();
            }
        }

        return environment.startDbmss(dbmss).then((res) => {
            this.utils.log(...res);
        });
    }
}
