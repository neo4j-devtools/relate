import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, SystemModule, SystemProvider} from '@relate/common';
import {trim} from 'lodash';

import {RequiredArgsError} from '../../errors';
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
        const {argv, flags} = this.parsed;
        const authToken = new AuthTokenModel({
            credentials: trim(flags.credentials),
            principal: trim(flags.principal),
            scheme: 'basic',
        });
        // @todo: figure this out in combination with TTY
        let [dbmsId] = argv;

        if (!dbmsId) {
            if (isTTY()) {
                // TODO - Once we have dbms:list we can make the user choose
                // the DBMS interactively.
                throw new RequiredArgsError(['dbmsIds']);
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
