import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, HOOK_EVENTS, registerHookListener, SystemModule, SystemProvider} from '@relate/common';

import AccessTokenCommand from '../../commands/dbms/access-token';
import {selectDbmsPrompt, passwordPrompt, inputPrompt} from '../../prompts';

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

        const dbmsId =
            args.dbms || (await selectDbmsPrompt('Select a DBMS to create an access token for', environment));
        const principal = flags.user || (await inputPrompt('Enter a Neo4j DBMS user'));
        const credentials = await passwordPrompt('Enter passphrase');

        const dbms = await environment.dbmss.get(dbmsId);
        const authToken = new AuthTokenModel({
            credentials,
            principal,
            scheme: 'basic',
        });

        registerHookListener(HOOK_EVENTS.DBMS_TO_BE_ONLINE_ATTEMPTS, ({currentAttempt}) => {
            if (currentAttempt < 2) {
                return;
            }

            if (currentAttempt === 2) {
                this.utils.warn('DBMS connection not available, retrying...');
                return;
            }

            this.utils.warn('still retrying...');
        });

        return environment.dbmss
            .createAccessToken(AccessTokenModule.DEFAULT_APP_ID, dbms.id, authToken)
            .then((accessToken) =>
                this.systemProvider.registerAccessToken(environment.id, dbms.id, authToken.principal, accessToken),
            )
            .then(this.utils.log);
    }
}
