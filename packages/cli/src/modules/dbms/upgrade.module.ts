import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, InvalidArgumentError, HOOK_EVENTS, registerHookListener} from '@relate/common';
import _ from 'lodash';
import semver from 'semver';
import cli from 'cli-ux';

import {isInteractive} from '../../stdin';
import UpgradeCommand from '../../commands/dbms/upgrade';
import {selectDbmsPrompt, selectPrompt} from '../../prompts';
import {getEntityDisplayName} from '../../utils/display.utils';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UpgradeModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof UpgradeCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    registerHookListeners() {
        const downloadBar = cli.progress({
            format: 'DOWNLOAD PROGRESS [{bar}] {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, () => downloadBar.start());
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, () => downloadBar.stop());
        registerHookListener(HOOK_EVENTS.DOWNLOAD_PROGRESS, ({percent}) =>
            downloadBar.update(Math.round(percent * 100)),
        );
        registerHookListener(HOOK_EVENTS.NEO4J_EXTRACT_START, (val) => cli.action.start(val));
        registerHookListener(HOOK_EVENTS.NEO4J_EXTRACT_STOP, () => cli.action.stop());

        registerHookListener(HOOK_EVENTS.BACKUP_START, () => cli.action.start('Creating backup of the original DBMS'));
        registerHookListener(HOOK_EVENTS.BACKUP_COMPLETE, () => cli.action.stop());

        registerHookListener(HOOK_EVENTS.DBMS_MIGRATION_START, () => cli.action.start('Migrating DBMS data'));
        registerHookListener(HOOK_EVENTS.DBMS_MIGRATION_STOP, () => cli.action.stop());
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        let {version = ''} = flags;
        const noCaching = flags['no-caching'];
        const noMigration = flags['no-migration'];
        const environment = await this.systemProvider.getEnvironment(environmentId);
        let {dbms: dbmsId = ''} = args;

        this.registerHookListeners();

        if (!dbmsId.length && isInteractive()) {
            const selectedDbms = await selectDbmsPrompt('Select a DBMS to upgrade', environment);
            dbmsId = selectedDbms;
        }

        const dbms = await environment.dbmss.get(dbmsId);

        if (!version) {
            const versions = (await environment.dbmss.versions()).filter((dbmsVersion) =>
                semver.gt(dbmsVersion.version, dbms.version!),
            );

            if (versions.isEmpty) {
                throw new InvalidArgumentError(`DBMS ${dbms.name} already latest version`);
            }

            const choices = new Map(_.entries(_.keyBy(versions.toArray(), (v) => `${v.version} ${v.edition}`)));
            const selected = await selectPrompt(
                'Select a version',
                [...choices].map(([k, v]) => ({
                    message: `[${v.origin.toLowerCase()}] ${v.version} ${v.edition}`,
                    name: k,
                })),
            );

            version = choices.get(selected)!.version;
        }

        return environment.dbmss.upgrade(dbms.id, version, !noMigration, noCaching).then((res) => {
            this.utils.log(getEntityDisplayName(res));
        });
    }
}
