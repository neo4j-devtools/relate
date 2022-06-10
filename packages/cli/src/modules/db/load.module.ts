import fse from 'fs-extra';
import {CliUx} from '@oclif/core';
import chalk from 'chalk';
import path from 'path';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, DBMS_STATUS, NotFoundError} from '@relate/common';

import {isInteractive, readStdin} from '../../stdin';
import LoadCommand from '../../commands/db/load';
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

        const filePath = path.resolve(from);

        try {
            await fse.ensureFile(filePath);
        } catch (e) {
            throw new NotFoundError(`File not found (${filePath})`);
        }

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
            CliUx.ux.action.start(`Stopping ${dbms.name} DBMS`);
            await environment.dbmss.stop([dbms.id]);
            CliUx.ux.action.stop(chalk.green('done'));
        }

        CliUx.ux.action.start(`Loading data from dump into ${dbms.name}`);
        return environment.dbs.load(dbms.id, database, filePath, force).then((res: string) => {
            let result = chalk.green('done');

            const message = ['------------------------------------------'];
            if (res.search(/Done: (\d*) files, (.*) processed./) !== -1) {
                const done = res.split('\n').reverse();
                message.push(chalk.green(done[1]));
                message.push(
                    `Successfully loaded data from ${chalk.cyan(filePath)} ` +
                        `into ${chalk.cyan(`${dbms.name}->${database}`)}`,
                );
            } else {
                result = chalk.red('failed');
                if (res.includes('Database already exists')) {
                    message.push(`Database already exists: ${chalk.cyan(database)}`);
                    message.push(`Select another database or use flag '--force' to overwrite existing database.`);
                }
                message.push(chalk.red(`Failed to load dump.`));
                message.push(chalk.red(`Logs:\n${res}`));
            }

            CliUx.ux.action.stop(result);

            this.utils.log(message.join('\n'));
        });
    }
}
