import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {ux} from '@oclif/core';

import {HOOK_EVENTS, registerHookListener, SystemModule, SystemProvider} from '@relate/common';
import InstallCommand from '../../commands/dbms-plugin/install';
import {inputPrompt, selectDbmssPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof InstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    registerHookListeners() {
        const downloadBar = ux.progress({
            format: 'Download progress [{bar}] {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });
        registerHookListener(HOOK_EVENTS.DOWNLOAD_START, () => downloadBar.start(100, 0));
        registerHookListener(HOOK_EVENTS.DOWNLOAD_STOP, () => downloadBar.stop());
        registerHookListener(HOOK_EVENTS.DOWNLOAD_PROGRESS, ({percent}) =>
            downloadBar.update(Math.round(percent * 100)),
        );
    }

    async onApplicationBootstrap(): Promise<void> {
        const {flags, argv} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        this.registerHookListeners();

        const plugin = flags.plugin || (await inputPrompt('Enter the name of the plugin to install'));
        const dbmss = argv.length
            ? argv
            : await selectDbmssPrompt('Select DBMSs in which to install the plugin', environment);

        return environment.dbmsPlugins.install(dbmss, plugin).then((plugins) => {
            ux.table(
                plugins.toArray(),
                {
                    name: {},
                    version: {
                        get: (p) => p.version.version,
                    },
                    isOfficial: {
                        header: 'Official',
                    },
                    homepageUrl: {
                        header: 'Homepage',
                    },
                    downloadUrl: {
                        get: (p) => p.version.downloadUrl,
                        extended: true,
                        header: 'Download',
                    },
                },
                {
                    printLine: this.utils.log,
                    ...flags,
                },
            );
        });
    }
}
