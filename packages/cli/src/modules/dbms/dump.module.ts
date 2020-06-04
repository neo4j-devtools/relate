import {cli} from 'cli-ux';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, DBMS_STATUS} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import DumpCommand from '../../commands/dbms/dump';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class DumpModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof DumpCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {outputDir, db} = flags;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        let {dbms: dbmsId} = this.parsed.args;
        if (!dbmsId) {
            if (isInteractive()) {
                dbmsId = await selectDbmsPrompt('Select a DBMS to dump DB data from', environment, DBMS_STATUS.STOPPED);
            } else {
                dbmsId = await readStdin();
            }
        }

        const dbms = await environment.dbmss.get(dbmsId);
        cli.action.start(`Dumping ${db} from ${dbms.name}`);
        return environment.dbmss.dbDump(dbms, db, outputDir).then((res: string) => {
            cli.action.stop();
            const result = res
                ? `Successfully dumped ${db} from ${dbms.name} to ${outputDir}`
                : `Failed to dump data from ${dbms.name}`;
            this.utils.log(result);
        });
    }
}
