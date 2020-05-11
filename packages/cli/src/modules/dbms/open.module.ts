import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import cli from 'cli-ux';

import OpenCommand from '../../commands/dbms/open';

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
        const {nameOrId} = args;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!nameOrId) {
            // @todo: figure this out in combination with TTY
            throw new Error(`Dbms must be specified`);
        }

        const dbms = await environment.getDbms(nameOrId);

        if (!dbms || !dbms.rootPath) {
            throw new Error(`DBMS ${nameOrId} could not be opened`);
        }

        return Promise.all([cli.open(dbms.rootPath), this.utils.log(`Opening dbms "${dbms.name}"`)]);
    }
}
