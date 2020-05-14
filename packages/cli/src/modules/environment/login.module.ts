import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
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
        const {environment: environmentId} = this.parsed.flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        const login = await environment.login();
        cli.open(login.authUrl);

        this.utils.log('Your browser has been opened to visit:');
        this.utils.log(`\n    ${login.authUrl}\n`);

        const data = await login.getToken();
        if (data && data.payload) {
            this.utils.log(`You are now logged in as [${data.payload.email}]`);
        } else {
            this.utils.log('Something went wrong.');
        }
    }
}
