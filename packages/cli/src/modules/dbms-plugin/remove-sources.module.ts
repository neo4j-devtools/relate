import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {NotFoundError, SystemModule, SystemProvider} from '@relate/common';
import RemoveSourcesCommand from '../../commands/dbms-plugin/remove-sources';
import {selectMultiplePrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class RemoveSourcesModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof RemoveSourcesCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags, argv} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        const selectSources = async () => {
            const sources = await environment.dbmsPlugins.listSources();
            const choices = sources
                .filter((source) => !source.isOfficial)
                .mapEach((source) => ({name: source.name}))
                .toArray();

            if (choices.length === 0) {
                throw new NotFoundError('No removable sources found', [
                    'Add a plugin source with "relate dbms-plugin:add-source"',
                ]);
            }

            return selectMultiplePrompt('Select sources to remove (use space to select)', choices);
        };

        const selectedSources = argv || (await selectSources());

        return environment.dbmsPlugins.removeSources(selectedSources).then((sources) => {
            cli.table(
                sources.toArray(),
                {
                    name: {},
                    homepageUrl: {
                        header: 'Homepage',
                    },
                    isOfficial: {
                        header: 'Official',
                    },
                    versionsUrl: {
                        header: 'Versions',
                        extended: true,
                    },
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
