import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, SystemModule, SystemProvider} from '@relate/common';
import {trim} from 'lodash';
import {prompt} from 'enquirer';

import {isTTY, readStdin} from '../../stdin';
import AccessTokenCommand from '../../commands/dbms/access-token';

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
        const account = this.systemProvider.getAccount(flags.account);
        const authToken = new AuthTokenModel({
            credentials: trim(flags.credentials),
            principal: trim(flags.principal),
            scheme: 'basic',
        });
        // @todo: figure this out in combination with TTY
        let {dbmsId} = args;

        if (!dbmsId) {
            if (isTTY()) {
                const dbmss = await account.listDbmss();

                const {selectedDbms} = await prompt({
                    choices: dbmss.map((dbms) => ({
                        message: `[${dbms.id}] ${dbms.name}`,
                        name: dbms.id,
                    })),
                    message: 'Select a DBMS',
                    name: 'selectedDbms',
                    type: 'select',
                });

                dbmsId = selectedDbms;
            } else {
                dbmsId = await readStdin().then(trim);
            }
        }

        return account
            .createAccessToken(AccessTokenModule.DEFAULT_APP_ID, dbmsId, authToken)
            .then((accessToken) =>
                this.systemProvider.registerAccessToken(flags.account, dbmsId, authToken.principal, accessToken),
            )
            .then(this.utils.log)
            .catch(({message}) => this.utils.error(message));
    }
}
