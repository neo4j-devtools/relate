import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {IProjectManifest, SystemModule, SystemProvider} from '@relate/common';

import InitCommand from '../../commands/project/init';
import {inputPrompt} from '../../prompts';
import {getEntityDisplayName} from '../../utils/display.utils';

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
        let {name} = this.parsed.flags;
        const {environment} = this.parsed.flags;
        const {projects} = await this.systemProvider.getEnvironment(environment);

        name = name || (await inputPrompt('Enter project name'));

        const config: IProjectManifest = {
            name,
            dbmss: [],
        };

        cli.action.start('Creating project');
        return projects.create(config).then((created) => {
            cli.action.stop();
            this.utils.log(getEntityDisplayName(created));
        });
    }
}
