import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {FILTER_COMPARATORS, SystemModule, SystemProvider} from '@relate/common';
import {CliUx} from '@oclif/core';

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
        const {environment: environmentId, limit} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));

        let {ignore = []} = flags;
        // This is to accept both common formats for arrays in the CLI:
        // command -i val1 -i val2 -i val3
        // command -i val1,val2,val3
        if (ignore.length === 1) {
            ignore = ignore[0].split(',');
        }

        const filter = ignore.map((dirname) => ({
            field: 'directory',
            type: FILTER_COMPARATORS.NOT_CONTAINS,
            value: dirname,
        }));
        const files = await environment.projects.listFiles(projectId, filter);

        CliUx.ux.table(
            files.toArray().slice(0, limit),
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
