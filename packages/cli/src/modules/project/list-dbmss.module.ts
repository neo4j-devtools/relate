import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {CliUx} from '@oclif/core';

import {selectProjectPrompt} from '../../prompts';
import ListDbmssCommand from '../../commands/project/list-dbmss';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListDbmssModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof ListDbmssCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));
        const projectDbmss = await environment.projects.listDbmss(projectId);

        CliUx.ux.table(
            projectDbmss.toArray(),
            {
                name: {},
                connectionUri: {},
                user: {get: ({user}) => user || ''},
                access: {get: ({accessToken}) => (accessToken ? 'Y' : 'N')},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
