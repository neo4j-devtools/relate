import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {List} from '@relate/types';
import cli from 'cli-ux';
import fse from 'fs-extra';
import fetch from 'node-fetch';

import {IDbmsPluginSource, SystemModule, SystemProvider} from '@relate/common';
import AddSourcesCommand from '../../commands/dbms-plugin/add-sources';
import {isInteractive, readStdin} from '../../stdin';
import {RequiredArgsError} from '../../errors';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AddSourcesModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof AddSourcesCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags, argv} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        let sources: IDbmsPluginSource[] = [];
        if (argv.length >= 1) {
            const sourcesList = await List.from(argv)
                .mapEach(async (pathOrUrl) => {
                    try {
                        const source = await fse.readJSON(pathOrUrl);
                        return source;
                    } catch {
                        return fetch(pathOrUrl).then((res) => res.json());
                    }
                })
                .unwindPromises();
            sources = sourcesList.toArray();
        }

        if (argv.length === 0 && !isInteractive()) {
            sources = JSON.parse(await readStdin());
        }

        if (sources.length === 0) {
            throw new RequiredArgsError(['sources']);
        }

        return environment.dbmsPlugins.addSources(sources).then((addedSources) => {
            cli.table(
                addedSources.toArray(),
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
