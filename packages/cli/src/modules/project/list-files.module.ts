import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import ListFilesCommand from '../../commands/project/list-files';
import {selectProjectPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListFilesModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof ListFilesCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));
        const files = await environment.projects.listFiles(projectId);

        cli.table(
            files.toArray(),
            {
                name: {},
                extension: {},
                directory: {},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
