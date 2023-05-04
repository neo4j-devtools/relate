import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {IDbmsInfo, SystemModule, SystemProvider} from '@relate/common';
import {List} from '@relate/types';
import {ux} from '@oclif/core';

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
        const {environment: environmentId, onlineCheck} = flags;

        const environment = await this.systemProvider.getEnvironment(environmentId);
        const namesOrIds = this.parsed.argv;

        let dbmss: List<IDbmsInfo>;
        if (namesOrIds.length === 0) {
            const ids = await environment.dbmss.list().then((dbmsList) => dbmsList.mapEach((dbms) => dbms.id));
            dbmss = await environment.dbmss.info(ids, onlineCheck);
        } else {
            dbmss = await environment.dbmss.info(namesOrIds, onlineCheck);
        }

        ux.table(
            dbmss.toArray(),
            {
                id: {},
                name: {},
                version: {},
                edition: {},
                prerelease: {
                    extended: true,
                },
                status: {},
                serverStatus: {
                    header: 'Server status',
                    extended: !onlineCheck,
                },
                uri: {
                    get: (dbms) => dbms.connectionUri,
                    extended: true,
                },
                path: {
                    get: (dbms) => dbms.rootPath,
                    extended: true,
                },
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );
    }
}
