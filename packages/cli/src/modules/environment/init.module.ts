import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {SystemModule, SystemProvider} from '@relate/common';

import InitCommand from '../../commands/environment/init';
import {inputPrompt, selectPrompt} from '../../prompts';
import {ENVIRONMENT_TYPES} from '@relate/common/dist/environments';
import {IEnvironmentConfig} from '@relate/common/dist/models/environment-config.model';

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
        let {type, name, remoteUrl, remoteEnv} = this.parsed.flags;

        const envChoices = Object.values(ENVIRONMENT_TYPES).map((name) => ({
            name,
            message: name.charAt(0).toLocaleUpperCase() + name.toLocaleLowerCase().slice(1),
        }));

        type = type || (await selectPrompt('Choose environment type', envChoices));
        name = name || (await inputPrompt('Enter environment name'));
        if (type === ENVIRONMENT_TYPES.REMOTE) {
            remoteUrl = remoteUrl || (await inputPrompt('Enter remote URL'));
            remoteEnv = remoteEnv || 'default';
        }

        const config: IEnvironmentConfig = {
            type: type as ENVIRONMENT_TYPES,
            id: name,
            relateURL: remoteUrl,
            relateEnvironment: remoteEnv,
            user: 'foo',
        };

        cli.action.start('Creating environment');
        return this.systemProvider.createEnvironment(config).then(() => cli.action.stop());
    }
}
