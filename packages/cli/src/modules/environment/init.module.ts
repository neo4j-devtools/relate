import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {ENVIRONMENT_TYPES, IEnvironmentConfig, SystemModule, SystemProvider} from '@relate/common';

import InitCommand from '../../commands/environment/init';
import {inputPrompt, selectPrompt} from '../../prompts';

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
        let {type, name, httpOrigin, remoteEnv} = this.parsed.flags;

        const envChoices = Object.values(ENVIRONMENT_TYPES).map((envType) => ({
            name: envType,
            message: envType.charAt(0).toLocaleUpperCase() + envType.toLocaleLowerCase().slice(1),
        }));

        type = type || (await selectPrompt('Choose environment type', envChoices));
        name = name || (await inputPrompt('Enter environment name (required)', {required: true}));
        if (type === ENVIRONMENT_TYPES.REMOTE) {
            httpOrigin = httpOrigin || (await inputPrompt('Enter remote URL'));
            remoteEnv = remoteEnv || 'default';
        }

        const config: IEnvironmentConfig = {
            type: type as ENVIRONMENT_TYPES,
            id: name,
            httpOrigin: httpOrigin && new URL(httpOrigin).origin,
            relateEnvironment: remoteEnv,
            user: 'foo',
        };

        cli.action.start('Creating environment');
        return this.systemProvider.createEnvironment(config).then(() => cli.action.stop());
    }
}
