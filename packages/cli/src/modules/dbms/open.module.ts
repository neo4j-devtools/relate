import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import {prompt} from 'enquirer';
import cli from 'cli-ux';

import OpenCommand from '../../commands/dbms/open';
import {isTTY, readStdinArray} from '../../stdin';

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
        let {nameOrId = ''} = args;
        const {environment: environmentId, log = false} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!nameOrId.length) {
            if (isTTY()) {
                const dbmss = await environment.listDbmss();

                const {selectedDbms} = await prompt({
                    choices: dbmss.map((dbms) => ({
                        message: `[${dbms.id}] ${dbms.name}`,
                        name: dbms.id,
                    })),
                    message: 'Select a DBMS',
                    name: 'selectedDbms',
                    type: 'select',
                });

                nameOrId = selectedDbms;
            } else {
                nameOrId = await readStdinArray();
            }
        }

        const dbms = await environment.getDbms(nameOrId);

        if (!dbms || !dbms.rootPath) {
            throw new Error(`DBMS ${nameOrId} could not be opened`);
        }

        return log ? this.utils.log(dbms.rootPath) : cli.open(dbms.rootPath);
    }
}
