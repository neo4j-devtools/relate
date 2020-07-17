import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {FILTER_COMPARATORS, SystemModule, SystemProvider} from '@relate/common';
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
        const dbmss = await environment.dbmss.list(
            /* eslint-disable indent */
            namesOrIds.length
                ? [
                      {
                          field: 'id',
                          value: namesOrIds,
                          type: FILTER_COMPARATORS.IN,
                      },
                  ]
                : [],
            /* eslint-enable indent */
        );

        const dbmsIds = dbmss.mapEach((dbms) => dbms.id).toArray();

        return environment.dbmss.info(dbmsIds).then((res) => {
            const table = res
                .mapEach((dbms) => {
                    return {
                        id: dbms.id,
                        name: dbms.name,
                        version: dbms.version,
                        edition: dbms.edition,
                        status: dbms.status.trim(),
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
