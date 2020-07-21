import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import cli from 'cli-ux';

import {SystemModule, SystemProvider, DBMS_STATUS} from '@relate/common';
import CreateCommand from '../../commands/db/create';
import {inputPrompt, selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class CreateModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof CreateCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {environment: environmentId, user} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        const dbms =
            flags.dbms ||
            (await selectDbmsPrompt('Select DBMS to create database in', environment, DBMS_STATUS.STARTED));

        let {name} = this.parsed.args;
        if (!name) {
            name = await inputPrompt('Enter a name for the new database');
        }

        const accessToken = await this.systemProvider.getAccessToken(environment.id, dbms, user);

        cli.action.start('Creating database');
        await environment.dbs.create(dbms, user, name, accessToken);
        cli.action.stop();
    }
}
