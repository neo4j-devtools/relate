import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, registerHookListener, HOOK_EVENTS} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';
import cli from 'cli-ux';

import InstallCommand from '../../commands/dbms/install';
import {selectPrompt, inputPrompt, passwordPrompt} from '../../prompts';

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
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.NEO4J_DOWNLOAD_STOP, () => cli.action.stop())
        registerHookListener(HOOK_EVENTS.NEO4J_EXTRACT_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.NEO4J_EXTRACT_STOP, () => cli.action.stop())
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        this.registerHookListeners();

        const name = flags.name || (await inputPrompt('Enter the DBMS name'));

        let {version = ''} = args;
        if (!version) {
            const versions = await environment.listDbmsVersions();
            version = await selectPrompt(
                'Select a version to install',
                versions.map((v) => ({
                    message: `[${v.origin.toLowerCase()}] ${v.version} ${v.edition}`,
                    name: v.version,
                })),
            );
        }
        const pathVersion = path.resolve(version);
        if (await fse.pathExists(pathVersion)) {
            version = pathVersion;
        }

        const credentials = await passwordPrompt('Enter new passphrase');

        return environment.installDbms(name, credentials, version).then((res) => {
            this.utils.log(res);
        });
    }
}
