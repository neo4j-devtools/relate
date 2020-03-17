import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, SystemModule, SystemProvider} from '@relate/common';
import {trim} from 'lodash';
import {prompt} from 'enquirer';

import {isTTY, readStdin} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AccessTokenModule implements OnApplicationBootstrap {
    static DEFAULT_APP_ID = 'relate';

    static DEFAULT_ACCOUNT_ID = 'foo';

    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<any>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const account = this.systemProvider.getAccount(AccessTokenModule.DEFAULT_ACCOUNT_ID);
        const {args, flags} = this.parsed;
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
                this.systemProvider.registerAccessToken(
                    AccessTokenModule.DEFAULT_ACCOUNT_ID,
                    dbmsId,
                    authToken.principal,
                    accessToken,
                ),
            )
            .then(this.utils.log)
            .catch(({message}) => this.utils.error(message));
    }
}
