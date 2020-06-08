import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider, DBMS_STATUS} from '@relate/common';
import {readStdinArray, isInteractive} from '../../stdin';
import StopCommand from '../../commands/dbms/stop';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StopModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof StopCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        let dbmss = this.parsed.argv;

        if (!dbmss.length) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to stop', environment, DBMS_STATUS.STARTED);
                dbmss = [selectedDbms];
            } else {
                dbmss = await readStdinArray();
            }
        }

        cli.action.start('Stopping Neo4j');
        return environment.dbmss.stop(dbmss).then(() => cli.action.stop());
    }
}
