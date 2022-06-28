import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {CliUx} from '@oclif/core';

import ListCommand from '../../commands/project/list';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof ListCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment} = flags;
        const {projects} = await this.systemProvider.getEnvironment(environment);
        const allProjects = await projects.list();

        CliUx.ux.table(
            allProjects.toArray(),
            {
                id: {},
                name: {},
                description: {},
                tags: {
                    get: (dbms) => dbms.tags.join(', '),
                },
                metadata: {
                    get: (project) => JSON.stringify(project.metadata),
                    extended: true,
                },
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
