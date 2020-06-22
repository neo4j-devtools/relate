import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider, DBMS_STATUS} from '@relate/common';
import ListCommand from '../../commands/db/list';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class ListModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof ListCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId, user} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        const dbms =
            flags.dbms || (await selectDbmsPrompt('Select DBMS to list database in', environment, DBMS_STATUS.STARTED));

        const accessToken = await this.systemProvider.getAccessToken(environment.id, dbms, user);

        const dbs = await environment.dbmss.dbList(dbms, user, accessToken);
        cli.table(
            dbs.toArray(),
            {
                name: {},
                role: {},
                requestedStatus: {},
                currentStatus: {},
                error: {},
                default: {},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
