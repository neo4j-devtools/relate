import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import OpenCommand from '../../commands/dbms/open';
import {isInteractive} from '../../stdin';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class OpenModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof OpenCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<any> {
        const {args, flags} = this.parsed;
        let {dbms: dbmsId = ''} = args;
        const {environment: environmentId, log = false} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!dbmsId.length && isInteractive()) {
            const selectedDbms = await selectDbmsPrompt('Select a DBMS to open', environment);
            dbmsId = selectedDbms;
        }

        const dbms = await environment.getDbms(dbmsId);

        if (!dbms || !dbms.rootPath) {
            throw new Error(`DBMS ${dbmsId} could not be opened`);
        }

        return log ? this.utils.log(dbms.rootPath) : cli.open(dbms.rootPath);
    }
}
