import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import path from 'path';

import {isInteractive, readStdin} from '../../stdin';
import {inputPrompt, selectProjectPrompt} from '../../prompts';
import AddFileCommand from '../../commands/project/add-file';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AddFileModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof AddFileCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {source} = args;
        const {environment: environmentId, destination} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));

        if (!source) {
            if (isInteractive()) {
                source = await inputPrompt('Enter source file path');
            } else {
                source = await readStdin();
            }
        }

        return environment.projects.addFile(projectId, path.resolve(source), destination).then((added) => {
            this.utils.log(`Added "${added.name}" to "${added.directory || '.'}" in project`);
        });
    }
}
