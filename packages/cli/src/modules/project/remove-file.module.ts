import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import {inputPrompt, selectProjectPrompt} from '../../prompts';
import RemoveFileCommand from '../../commands/project/remove-file';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class RemoveFileModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof RemoveFileCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {file} = args;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));

        if (!file) {
            if (isInteractive()) {
                file = await inputPrompt('Enter (project) file path to remove');
            } else {
                file = await readStdin();
            }
        }

        return environment.projects.removeFile(projectId, file).then((removed) => {
            this.utils.log(`Removed "${removed.name}" from "${removed.directory || '.'}" in project`);
        });
    }
}
