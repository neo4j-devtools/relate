import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, SystemModule, SystemProvider} from '@relate/common';
import {trim} from 'lodash';

import {isInteractive, readStdin} from '../../stdin';
import AccessTokenCommand from '../../commands/dbms/access-token';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AccessTokenModule implements OnApplicationBootstrap {
    static DEFAULT_APP_ID = 'relate';

    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof AccessTokenCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        const authToken = new AuthTokenModel({
            credentials: trim(flags.credentials),
            principal: trim(flags.principal),
            scheme: 'basic',
        });
        // @todo: figure this out in combination with TTY
        let {dbmsId} = args;

        if (!dbmsId) {
            if (isInteractive()) {
                const dbmss = await environment.listDbmss();
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to create an access token for', dbmss);
                dbmsId = selectedDbms;
            } else {
                dbmsId = await readStdin().then(trim);
            }
        }

        const dbms = await environment.getDbms(dbmsId);

        return environment
            .createAccessToken(AccessTokenModule.DEFAULT_APP_ID, dbms.id, authToken)
            .then((accessToken) =>
                this.systemProvider.registerAccessToken(environment.id, dbms.id, authToken.principal, accessToken),
            )
            .then(this.utils.log);
    }
}
