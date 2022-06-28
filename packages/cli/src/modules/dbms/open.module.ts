import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {CliUx} from '@oclif/core';

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

    logOrOpen(path: string): void {
        if (this.parsed.flags.log) {
            this.utils.log(path);
        } else {
            CliUx.ux.open(path);
        }
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {dbms: dbmsId = ''} = args;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!dbmsId.length && isInteractive()) {
            const selectedDbms = await selectDbmsPrompt('Select a DBMS to open', environment);
            dbmsId = selectedDbms;
        }

        const dbms = await environment.dbmss.get(dbmsId);

        if (!dbms || !dbms.rootPath) {
            throw new Error(`DBMS ${dbmsId} could not be opened`);
        }

        this.logOrOpen(dbms.rootPath);
    }
}
