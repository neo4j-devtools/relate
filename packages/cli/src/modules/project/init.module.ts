import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';
import {IProjectInput, SystemModule, SystemProvider} from '@relate/common';

import InitCommand from '../../commands/project/init';
import {inputPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InitModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InitCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        let {name} = flags;
        const {environment} = flags;
        const {projects} = await this.systemProvider.getEnvironment(environment);

        name = name || (await inputPrompt('Enter project name'));

        const config: Omit<IProjectInput, 'id'> = {
            name,
            dbmss: [],
        };

        CliUx.ux.action.start('Creating project');

        return projects.create(config).then((created) => {
            CliUx.ux.action.stop();
            this.utils.log(created.name);
        });
    }
}
