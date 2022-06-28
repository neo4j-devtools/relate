import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';
import {List} from '@relate/types';
import {SystemModule, SystemProvider, DBMS_STATUS, IQueryTarget} from '@relate/common';

import {readStdinArray, isInteractive} from '../../stdin';
import StopCommand from '../../commands/dbms/stop';
import {passwordPrompt, selectDbmsPrompt} from '../../prompts';
import {EnvironmentAbstract} from '@relate/common/dist/entities/environments';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class StopModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof StopCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        let dbmss: string[] | List<IQueryTarget> = this.parsed.argv;

        if (!dbmss.length) {
            if (isInteractive()) {
                const selectedDbms = await selectDbmsPrompt('Select a DBMS to stop', environment, DBMS_STATUS.STARTED);
                dbmss = [selectedDbms];
            } else {
                dbmss = await readStdinArray();
            }
        }

        if (flags.shutdown) {
            dbmss = await List.from(dbmss)
                .mapEach((nameOrId) => getDbConnection(this.systemProvider, environment, nameOrId))
                .unwindPromises();
        }

        CliUx.ux.action.start('Stopping Neo4j');
        return environment.dbmss.stop(dbmss).then(() => CliUx.ux.action.stop());
    }
}

async function getDbConnection(
    systemProvider: SystemProvider,
    environment: EnvironmentAbstract,
    nameOrId: string,
): Promise<IQueryTarget> {
    const dbms = await environment.dbmss.get(nameOrId);

    let accessToken;
    try {
        accessToken = await systemProvider.getAccessToken(environment.id, dbms.id, 'neo4j');
    } catch {
        accessToken = await environment.dbmss.createAccessToken('relate', dbms.id, {
            principal: 'neo4j',
            credentials: await passwordPrompt(`Enter password for "${dbms.name}"`),
            scheme: 'basic',
        });

        await systemProvider.registerAccessToken(environment.id, dbms.id, 'neo4j', accessToken);
    }

    return {
        accessToken,
        dbmsUser: 'neo4j',
        dbmsNameOrId: dbms.id,
    };
}
