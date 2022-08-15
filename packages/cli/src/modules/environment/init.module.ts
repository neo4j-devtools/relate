import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';
import {
    ENVIRONMENT_TYPES,
    IEnvironmentConfigInput,
    SystemModule,
    SystemProvider,
    downloadJava,
    registerHookListener,
    HOOK_EVENTS,
    resolveRelateJavaHome,
} from '@relate/common';

import InitCommand from '../../commands/environment/init';
import {confirmPrompt, inputPrompt, selectAllowedMethodsPrompt} from '../../prompts';

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

    registerHookListeners() {
        const downloadBar = CliUx.ux.progress({
            format: 'Downloading Java [{bar}] {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });
        registerHookListener(HOOK_EVENTS.JAVA_DOWNLOAD_START, () => downloadBar.start());
        registerHookListener(HOOK_EVENTS.JAVA_DOWNLOAD_STOP, () => downloadBar.stop());
        registerHookListener(HOOK_EVENTS.DOWNLOAD_PROGRESS, ({percent}) =>
            downloadBar.update(Math.round(percent * 100)),
        );

        registerHookListener(HOOK_EVENTS.JAVA_EXTRACT_START, (val) => CliUx.ux.action.start(val));
        registerHookListener(HOOK_EVENTS.JAVA_EXTRACT_STOP, () => CliUx.ux.action.stop());
    }

    async onApplicationBootstrap(): Promise<void> {
        let {environment: name} = this.parsed.args;
        const {interactive, use, noRuntime, apiToken} = this.parsed.flags;

        this.registerHookListeners();

        name = name || (await inputPrompt('Enter environment name'));

        const config: IEnvironmentConfigInput = {
            type: ENVIRONMENT_TYPES.LOCAL,
            name,
        };

        if (interactive) {
            const requiresAPIToken =
                apiToken || (await confirmPrompt('Are HTTP consumers required to have an API key?'));

            if (requiresAPIToken) {
                const publicGraphQLMethods = await selectAllowedMethodsPrompt();

                config.serverConfig = {
                    requiresAPIToken,
                    publicGraphQLMethods,
                };
            }
        }

        CliUx.ux.action.start('Creating environment');
        await this.systemProvider.createEnvironment(config);
        CliUx.ux.action.stop();

        await Promise.all(
            ['4.0.0', '5.0.0'].map(async (version) => {
                const relateJavaExists = await resolveRelateJavaHome(version);
                if (!noRuntime && !relateJavaExists) {
                    await downloadJava(version);
                }
            }),
        );

        if (use) {
            await this.systemProvider.useEnvironment(name);
            this.utils.log(`Environment "${name}" is now set as active.`);
        }
    }
}
