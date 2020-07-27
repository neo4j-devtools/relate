import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';
import {
    IAuthenticationOptions,
    ENVIRONMENT_TYPES,
    HEALTH_BASE_ENDPOINT,
    InvalidArgumentError,
    IEnvironmentConfigInput,
    SystemModule,
    SystemProvider,
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
import {isInteractive} from '../../stdin';

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
        let {type, name, httpOrigin, sandboxed} = this.parsed.flags;
        let remoteEnvironmentId: string | undefined = undefined;

        const envChoices = Object.values(ENVIRONMENT_TYPES).map((envType) => ({
            name: envType,
            message: envType.charAt(0).toLocaleUpperCase() + envType.toLocaleLowerCase().slice(1),
        }));

        type = type || (await selectPrompt('Choose environment type', envChoices));
        name = name || (await inputPrompt('Enter environment name'));

        if (type === ENVIRONMENT_TYPES.REMOTE) {
            httpOrigin = httpOrigin || (await inputPrompt('Enter remote origin (without trailing slash)'));
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
        }

        if (isInteractive()) {
            const authentication: IAuthenticationOptions | undefined = await selectAuthenticatorPrompt();
            sandboxed = sandboxed || (await confirmPrompt('Is this environment sandboxed (lacks admin privileges)?'));
            const allowedMethods: string[] = await selectAllowedMethodsPrompt();
            const config: IEnvironmentConfigInput = {
                type: type as ENVIRONMENT_TYPES,
                name: name,
                sandboxed,
                httpOrigin: httpOrigin && new URL(httpOrigin).origin,
                remoteEnvironmentId,
                authentication,
                allowedMethods,
            };

            cli.action.start('Creating environment');
            return this.systemProvider.createEnvironment(config).then(() => cli.action.stop());
        }

        const config: IEnvironmentConfigInput = {
            type: type as ENVIRONMENT_TYPES,
            name: name,
            sandboxed,
            httpOrigin: httpOrigin && new URL(httpOrigin).origin,
            remoteEnvironmentId,
        };

        cli.action.start('Creating environment');
        return this.systemProvider.createEnvironment(config).then(() => cli.action.stop());
    }
}
