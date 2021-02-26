import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {
    ENVIRONMENT_TYPES,
    HEALTH_BASE_ENDPOINT,
    InvalidArgumentError,
    IEnvironmentConfigInput,
    SystemModule,
    SystemProvider,
    downloadJava,
    registerHookListener,
    HOOK_EVENTS,
    resolveRelateJavaHome,
} from '@relate/common';
import fetch from 'node-fetch';

import InitCommand from '../../commands/environment/init';
import {
    confirmPrompt,
    inputPrompt,
    selectAllowedMethodsPrompt,
    selectAuthenticatorPrompt,
    selectPrompt,
} from '../../prompts';

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
        const downloadBar = cli.progress({
            format: 'Downloading Java [{bar}] {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });
        registerHookListener(HOOK_EVENTS.JAVA_DOWNLOAD_START, () => downloadBar.start());
        registerHookListener(HOOK_EVENTS.JAVA_DOWNLOAD_STOP, () => downloadBar.stop());
        registerHookListener(HOOK_EVENTS.DOWNLOAD_PROGRESS, ({percent}) =>
            downloadBar.update(Math.round(percent * 100)),
        );

        registerHookListener(HOOK_EVENTS.JAVA_EXTRACT_START, (val) => cli.action.start(val));
        registerHookListener(HOOK_EVENTS.JAVA_EXTRACT_STOP, () => cli.action.stop());
    }

    async onApplicationBootstrap(): Promise<void> {
        let {environment: name, httpOrigin} = this.parsed.args;
        let {type} = this.parsed.flags;
        const {interactive, use, noRuntime} = this.parsed.flags;
        let remoteEnvironmentId: string | undefined = undefined;

        this.registerHookListeners();

        name = name || (await inputPrompt('Enter environment name'));

        let config: IEnvironmentConfigInput = {
            type: type || ENVIRONMENT_TYPES.LOCAL,
            name,
        };

        if (interactive) {
            const envChoices = Object.values(ENVIRONMENT_TYPES).map((envType) => ({
                name: envType,
                message: envType.charAt(0).toLocaleUpperCase() + envType.toLocaleLowerCase().slice(1),
            }));

            type = type || (await selectPrompt('Choose environment type', envChoices));
        }

        if (interactive && type === ENVIRONMENT_TYPES.REMOTE) {
            httpOrigin = httpOrigin || (await inputPrompt('Enter remote URL (without trailing slash)'));

            try {
                remoteEnvironmentId = await fetch(`${httpOrigin}${HEALTH_BASE_ENDPOINT}`)
                    .then((res) => res.json())
                    .then(({relateEnvironmentId}) => relateEnvironmentId);
            } catch (_e) {
                throw new InvalidArgumentError(`${httpOrigin} does not seem to be a valid @relate/web server instance`);
            }

            if (!remoteEnvironmentId) {
                throw new InvalidArgumentError(`${httpOrigin} does not seem to be a valid @relate/web server instance`);
            }

            const authentication = await selectAuthenticatorPrompt();
            const publicGraphQLMethods = await selectAllowedMethodsPrompt();
            const requiresAPIToken = await confirmPrompt('Are HTTP consumers required to have an API key?');
            config = {
                name,
                type,
                httpOrigin: httpOrigin && new URL(httpOrigin).origin,
                remoteEnvironmentId,
                authentication,
                serverConfig: {
                    publicGraphQLMethods,
                    requiresAPIToken,
                },
            };
        }

        cli.action.start('Creating environment');
        await this.systemProvider.createEnvironment(config);
        cli.action.stop();

        const relateJavaExists = await resolveRelateJavaHome('4.0.0');
        if ((!type || type === ENVIRONMENT_TYPES.LOCAL) && !noRuntime && !relateJavaExists) {
            await downloadJava('4.0.0');
        }

        if (use) {
            await this.systemProvider.useEnvironment(name);
            this.utils.log(`Environment "${name}" is now set as active.`);
        }
    }
}
