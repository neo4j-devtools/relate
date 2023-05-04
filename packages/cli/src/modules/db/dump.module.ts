import {ux} from '@oclif/core';
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
        const file = path.join(to || `${dbms.name}-${database}-${date.replace(/:/g, '')}.dump`);

        const filePath = path.resolve(file);

        if (dbms.status === DBMS_STATUS.STARTED) {
            ux.action.start(`Stopping ${dbms.name} DBMS`);
            await environment.dbmss.stop([dbms.id]);
            ux.action.stop(chalk.green('done'));
        }

        ux.action.start(`Dumping ${database} from ${dbms.name}`);
        return environment.dbs.dump(dbms.id, database, filePath).then((res: string) => {
            this.utils.log(res);
            ux.action.stop();
        });
    }
}
