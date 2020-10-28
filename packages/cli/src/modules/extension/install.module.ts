import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {
    arrayHasItems,
    EXTENSION_ORIGIN,
    IExtensionVersion,
    InvalidArgumentError,
    SystemModule,
    SystemProvider,
    registerHookListener,
    HOOK_EVENTS,
} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';
import _ from 'lodash';
import cli from 'cli-ux';
import semver from 'semver';

import InstallCommand from '../../commands/extension/install';
import {selectPrompt} from '../../prompts';

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
            format: 'DOWNLOAD PROGRESS [{bar}] {percentage}%',
            barCompleteChar: '\u2588',
            barIncompleteChar: '\u2591',
        });
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_START, () => downloadBar.start());
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DOWNLOAD_STOP, () => downloadBar.stop());
        registerHookListener(HOOK_EVENTS.DOWNLOAD_PROGRESS, ({percent}) =>
            downloadBar.update(Math.round(percent * 100)),
        );
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_START, (val) => cli.action.start(val));
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_STOP, () => cli.action.stop());
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DIRECTORY_MOVE_START, (val) => cli.action.start(val));
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DIRECTORY_MOVE_STOP, () => cli.action.stop());
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_START, (val) => cli.action.start(val));
        registerHookListener(HOOK_EVENTS.RELATE_EXTENSION_DEPENDENCIES_INSTALL_STOP, ({stdout, stderr}) => {
            cli.action.stop();
            this.utils.debug(stdout);
            this.utils.debug(stderr);
        });
    }

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {name} = args;
        let {version = ''} = flags;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        this.registerHookListeners();

        if (!version || (semver.valid(version) && !name)) {
            const versions = (await environment.extensions.versions()).toArray();
            const cached = _.filter(versions, ({origin}) => origin === EXTENSION_ORIGIN.CACHED);
            const onlineNotCached = _.filter(versions, (v) => {
                if (v.origin !== EXTENSION_ORIGIN.ONLINE) {
                    return false;
                }

                return !_.some(cached, (cache) => cache.name === v.name && cache.version === v.version);
            });
            const choices = new Map(
                _.entries(_.keyBy([...cached, ...onlineNotCached], (v) => `${v.name}@${v.version}`)),
            );

            if (choices.size === 0) {
                throw new InvalidArgumentError(`Could not find extensions to install`);
            }

            const maybeWithName = name
                ? _.filter([...choices.values()], (v) => v.name === name)
                : [...choices.values()];

            if (!arrayHasItems(maybeWithName)) {
                throw new InvalidArgumentError(`Could not find installable extension with name: ${name}`);
            }

            const selected = await selectPrompt(
                'Select a version to install',
                _.map(maybeWithName, (v) => ({
                    name: `${v.name}@${v.version}`,
                    message: `[${v.origin.toLowerCase()}] ${v.name}@${v.version}`,
                })),
            );

            const selectedExtension: IExtensionVersion = choices.get(selected)!;
            version = selectedExtension.version;
            name = selectedExtension.name;
        }

        const pathVersion = path.resolve(version);

        if (pathVersion && (await fse.pathExists(pathVersion))) {
            version = pathVersion;
        }

        return environment.extensions.install(name, version).then((res: {name: string | undefined}) => {
            this.utils.log(`${res.name} successfully installed`);
        });
    }
}
