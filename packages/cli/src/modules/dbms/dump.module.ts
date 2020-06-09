import {cli} from 'cli-ux';
import chalk from 'chalk';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, DBMS_STATUS, NotFoundError} from '@relate/common';

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
                dbmsId = await selectDbmsPrompt('Select a DBMS to dump DB data from', environment);
            } else {
                dbmsId = await readStdin();
            }
        }

        const dbmsInfo = await environment.dbmss.info([dbmsId]);
        const dbms = dbmsInfo.first.getOrElse(() => {
            throw new NotFoundError('No DBMS is installed', ['Run "relate dbms:install" and try again']);
        });

        if (dbms.status === DBMS_STATUS.STARTED) {
            cli.action.start(`Stopping ${dbms.name} DBMS`);
            await environment.dbmss.stop([dbms.id]);
            cli.action.stop();
        }

        cli.action.start(`Dumping ${db} from ${dbms.name}`);
        return environment.dbmss.dbDump(dbms, db, outputDir).then((res: string) => {
            cli.action.stop();

            const done = res.split('\n').reverse();
            const success =
                `${chalk.green(done[1])}` +
                '\n' +
                `Successfully dumped ${chalk.cyan(db)} from ${chalk.cyan(dbms.name)} to ${chalk.cyan(outputDir)}`;

            const result =
                done[1] && done[1].search(/Done: (\d*) files, (.*) processed./) !== -1
                    ? success
                    : chalk.red(`Failed to dump data from ${dbms.name}`);

            this.utils.log(result);
        });
    }
}
