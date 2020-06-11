import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import ListCommand from '../../commands/project/list';
import {getEntityDisplayName} from '../../utils/display.utils';

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

        cli.table(
            allProjects.toArray(),
            {
                name: {get: getEntityDisplayName},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
