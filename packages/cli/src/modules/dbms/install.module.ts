import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, registerHookListener, HOOK_EVENTS, NEO4J_EDITION} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';
import cli from 'cli-ux';
import _ from 'lodash';

import InstallCommand from '../../commands/dbms/install';
import {selectPrompt, inputPrompt, passwordPrompt} from '../../prompts';
import {getEntityDisplayName} from '../../utils/display.utils';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    registerHookListeners() {
        const downloadBar = cli.progress({
            format: 'Download progress [{bar}] {percentage}%',
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
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId, limited, noCaching} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        this.registerHookListeners();

        const name = flags.name || (await inputPrompt('Enter the DBMS name'));

        let {version = ''} = args;
        let edition: NEO4J_EDITION | undefined;
        if (!version) {
            const versions = (await environment.dbmss.versions(limited)).toArray();
            const choices = new Map(_.entries(_.keyBy(versions, (v) => `${v.version} ${v.edition}`)));
            const selected = await selectPrompt(
                'Select a version to install',
                [...choices].map(([k, v]) => ({
                    message: `[${v.origin.toLowerCase()}] ${v.version} ${v.edition}`,
                    name: k,
                })),
            );

            version = choices.get(selected)!.version;
            edition = choices.get(selected)!.edition;
        }
        const pathVersion = path.resolve(version);
        if (await fse.pathExists(pathVersion)) {
            version = pathVersion;
        }

        const credentials = await passwordPrompt('Enter new passphrase');

        return environment.dbmss.install(name, version, edition, credentials, noCaching, limited).then((res) => {
            this.utils.log(getEntityDisplayName(res));
        });
    }
}
