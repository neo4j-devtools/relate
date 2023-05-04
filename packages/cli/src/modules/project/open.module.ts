import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {openApp} from 'open';

import {selectProjectPrompt} from '../../prompts';
import OpenCommand from '../../commands/project/open';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class OpenModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof OpenCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    logOrOpen(path: string): void {
        if (this.parsed.flags.log) {
            this.utils.log(path);
        } else {
            openApp(path);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));

        const project = await environment.projects.get(projectId);

        this.logOrOpen(project.root);
    }
}
