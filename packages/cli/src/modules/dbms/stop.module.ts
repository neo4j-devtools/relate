import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider} from '@relate/common';
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
        let dbmsIds = this.parsed.argv;

        if (!dbmsIds.length) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to stop', environment);
                dbmsIds = [selectedDbms];
            } else {
                dbmsIds = await readStdinArray();
            }
        }

        cli.action.start('Stopping Neo4j');
        return environment.stopDbmss(dbmsIds).then(() => cli.action.stop());
    }
}
