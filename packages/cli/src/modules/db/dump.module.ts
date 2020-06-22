import {cli} from 'cli-ux';
import chalk from 'chalk';
import path from 'path';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, DBMS_STATUS, NotFoundError} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import DumpCommand from '../../commands/db/dump';
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
        const {to, database} = flags;
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

        const dateISO = new Date().toISOString();
        const [date] = dateISO.split('.');
        const file = path.join(to || `${dbms.name}-${database}-${date.replace(':', '')}.dump`);

        const filePath = path.resolve(file);

        if (dbms.status === DBMS_STATUS.STARTED) {
            cli.action.start(`Stopping ${dbms.name} DBMS`);
            await environment.dbmss.stop([dbms.id]);
            cli.action.stop(chalk.green('done'));
        }

        cli.action.start(`Dumping ${database} from ${dbms.name}`);
        return environment.dbmss.dbDump(dbms.id, database, filePath).then((res: string) => {
            let result = chalk.green('done');

            const message = ['------------------------------------------'];
            if (res.search(/Done: (\d*) files, (.*) processed./) !== -1) {
                const done = res.split('\n').reverse();
                message.push(chalk.green(done[1]));
                message.push(
                    `Successfully dumped ${chalk.cyan(database)} ` +
                        `from ${chalk.cyan(dbms.name)} to ${chalk.cyan(filePath)}`,
                );
            } else {
                result = chalk.red('failed');
                if (res.includes('Database does not exist')) {
                    message.push(`Database does not exist: ${chalk.cyan(database)}`);
                }
                message.push(chalk.red(`Failed to dump data.`));
            }

            cli.action.stop(result);

            this.utils.log(message.join('\n'));
        });
    }
}
