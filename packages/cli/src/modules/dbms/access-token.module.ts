import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, SystemModule, SystemProvider} from '@relate/common';

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
        const credentials = flags.credentials || await passwordPrompt('Enter passphrase');

        const dbms = await environment.dbmss.get(dbmsId);
        const authToken = new AuthTokenModel({
            credentials,
            principal,
            scheme: 'basic',
        });

        return environment.dbmss
            .createAccessToken(AccessTokenModule.DEFAULT_APP_ID, dbms.id, authToken)
            .then((accessToken) =>
                this.systemProvider.registerAccessToken(environment.id, dbms.id, authToken.principal, accessToken),
            )
            .then(this.utils.log);
    }
}
