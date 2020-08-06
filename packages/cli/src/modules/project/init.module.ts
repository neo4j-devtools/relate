import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {IProjectInput, SystemModule, SystemProvider} from '@relate/common';
import path from 'path';

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
        const {args, flags} = this.parsed;
        let {name} = flags;
        const {environment} = flags;
        const {targetDir} = args;
        const {projects} = await this.systemProvider.getEnvironment(environment);
        const resolvedDir = path.resolve(targetDir);

        name = name || (await inputPrompt('Enter project name'));

        const config: IProjectInput = {
            name,
            dbmss: [],
        };

        cli.action.start('Creating project');

        return projects.create(config, resolvedDir).then((created) => {
            cli.action.stop();
            this.utils.log(created.name);
        });
    }
}
