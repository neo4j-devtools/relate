import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {IDbms, SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import InfoCommand from '../../commands/dbms/info';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InfoModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InfoCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        const namesOrIds = this.parsed.argv;
        const dbmss: Omit<IDbms, 'config'>[] = !namesOrIds.length
            ? (await environment.dbmss.list()).toArray()
            : await Promise.all(namesOrIds.map((n) => environment.dbmss.get(n)));
        const dbmsIds = dbmss.map((dbms) => dbms.id);

        await environment.dbmss.info(dbmsIds, true).then((res) => {
            const table = res
                .mapEach((dbms) => {
                    return {
                        id: dbms.id,
                        name: dbms.name,
                        version: dbms.version,
                        edition: dbms.edition,
                        status: dbms.status,
                        // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                        server_status: dbms.serverStatus,
                        uri: dbms.connectionUri,
                        path: dbms.rootPath,
                    };
                })
                .toArray();

            cli.table(
                table,
                {
                    id: {},
                    name: {},
                    version: {},
                    edition: {},
                    status: {},
                    // eslint-disable-next-line camelcase, @typescript-eslint/camelcase
                    server_status: {},
                    uri: {
                        extended: true,
                    },
                    path: {
                        extended: true,
                    },
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
