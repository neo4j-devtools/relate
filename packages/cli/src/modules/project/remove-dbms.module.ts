import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {selectProjectDbmsPrompt, selectProjectPrompt} from '../../prompts';
import RemoveDbmsCommand from '../../commands/project/remove-dbms';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class RemoveDbmsModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof RemoveDbmsCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));
        const projectDbmss = await environment.projects.listDbmss(projectId);
        const toRemove = args.dbms || (await selectProjectDbmsPrompt('Select project Dbms', projectDbmss.toArray()));

        return environment.projects
            .removeDbms(projectId, toRemove)
            .then(() => this.utils.log(`Removed ${toRemove} from project.`));
    }
}
