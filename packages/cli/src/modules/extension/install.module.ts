import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {arrayHasItems, EXTENSION_ORIGIN, InvalidArgumentError, SystemModule, SystemProvider, registerHookListener, HOOK_EVENTS} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import cli from 'cli-ux';

import InstallCommand from '../../commands/extension/install';
import {selectPrompt} from '../../prompts';
import {IExtensionVersion} from '@relate/common/dist/environments/local.environment/utils';

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
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_STOP, () => cli.action.stop())
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_STOP, () => cli.action.stop())
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DIRECTORY_MOVE_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DIRECTORY_MOVE_STOP, () => cli.action.stop())
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_START, (val) => cli.action.start(val))
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP, ({stdout, stderr}) => {
            cli.action.stop();
            this.utils.log(stdout);
            this.utils.log(stderr);
        })
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {name} = args;
        let {version = ''} = flags;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        this.registerHookListeners();

        if (!(name && version)) {
            const versions = await environment.listExtensionVersions();
            const cached = _.filter(versions, ({origin}) => origin === EXTENSION_ORIGIN.CACHED);
            const onlineNotCached = _.filter(versions, (v) => {
                if (v.origin !== EXTENSION_ORIGIN.ONLINE) {
                    return false;
                }

                return !_.some(cached, (cache) => cache.name === v.name && cache.version === v.version);
            });
            const choices = [...cached, ...onlineNotCached];

            if (!arrayHasItems(choices)) {
                throw new InvalidArgumentError(`Could not find extensions to install`);
            }

            const maybeWithName = name ? _.filter(choices, (v) => v.name === name) : choices;
            const selected = await selectPrompt(
                'Select a version to install',
                _.map(maybeWithName, (v) => ({
                    name: JSON.stringify(v),
                    message: `[${v.origin.toLowerCase()}] ${v.name}@${v.version}`,
                })),
            );

            const selectedExtension: IExtensionVersion = JSON.parse(selected);
            version = selectedExtension.version;
            name = selectedExtension.name;
        }

        const pathVersion = path.resolve(version);

        if (pathVersion && (await fse.pathExists(pathVersion))) {
            version = pathVersion;
        }

        return environment.installExtension(name, version).then((res: { name: string | undefined; }) => {
            this.utils.log(`${res.name} successfully installed`);
        });
    }
}
