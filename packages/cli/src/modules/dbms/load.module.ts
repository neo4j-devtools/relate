import {cli} from 'cli-ux';
import chalk from 'chalk';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, DBMS_STATUS, NotFoundError} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import LoadCommand from '../../commands/dbms/load';
import {selectDbmsPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class LoadModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof LoadCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {from, database, force} = flags;
        const environment = await this.systemProvider.getEnvironment(flags.environment);

        let {dbms: dbmsId} = this.parsed.args;
        if (!dbmsId) {
            if (isInteractive()) {
                dbmsId = await selectDbmsPrompt('Select a DBMS to load data to', environment);
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
            cli.action.stop(chalk.green('done'));
        }

        cli.action.start(`Loading data from dump into ${dbms.name}`);
        return environment.dbmss.dbLoad(dbms, database, from, force).then((res: string) => {
            let result = chalk.green('done');

            const message = ['------------------------------------------'];
            if (res.search(/Done: (\d*) files, (.*) processed./) !== -1) {
                const done = res.split('\n').reverse();
                message.push(chalk.green(done[1]));
                message.push(
                    `Successfully loaded data from ${chalk.cyan(from)} ` +
                        `into ${chalk.cyan(`${dbms.name}->${database}`)}`,
                );
            } else {
                result = chalk.red('failed');
                if (res.includes('Database already exists')) {
                    message.push(`Database already exists: ${chalk.cyan(database)}`);
                    message.push(`Select another database or use flag '--force' to overwrite existing database.`);
                }
                message.push(chalk.red(`Failed to load dump.`));
            }

            cli.action.stop(result);

            this.utils.log(message.join('\n'));
        });
    }
}
