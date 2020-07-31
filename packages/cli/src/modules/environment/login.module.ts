import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {LOCAL_OAUTH_REDIRECT, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import LoginCommand from '../../commands/environment/login';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class LoginModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof LoginCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args} = this.parsed;
        const {environment: environmentId} = args;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const login = await environment.login(LOCAL_OAUTH_REDIRECT);

        // @todo: local server needs time...
        setTimeout(() => cli.open(login.authUrl), 1000);
        this.utils.log('Your browser has been opened to visit:');
        this.utils.log(`\n    ${login.authUrl}\n`);

        const authToken = await login.getToken();

        await environment.updateConfig('authToken', authToken);

        if (authToken) {
            this.utils.log(`You are now logged in`);
        } else {
            this.utils.log('Something went wrong.');
        }
    }
}
