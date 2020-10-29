import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {IExtensionInfo, SystemModule, SystemProvider, InvalidArgumentError} from '@relate/common';
import _ from 'lodash';

import UninstallCommand from '../../commands/extension/uninstall';
import {selectPrompt} from '../../prompts';
import {readStdin, isInteractive} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class UninstallModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof UninstallCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {extension: name} = args;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const installedExtensions = (await environment.extensions.list()).toArray();

        if (!installedExtensions.length) {
            throw new InvalidArgumentError(`Could not find extensions to uninstall`);
        }

        if (!name) {
            if (isInteractive()) {
                name = await selectPrompt(
                    'Select an extension to uninstall',
                    _.map(installedExtensions, (v) => ({
                        name: `${v.name}`,
                        message: `[${v.origin.toLowerCase()}] ${v.name}@${v.version}`,
                    })),
                );
            } else {
                name = await readStdin();
            }
        }
        return environment.extensions.uninstall(name).then((exts) => {
            // @todo: will we have more than 1 version installed? If so, will
            // need to pass in / select version to uninstall
            const extFormatter = (ext: IExtensionInfo): string => `${ext.name}@${ext.version}`;

            this.utils.log(`Uninstalled ${_.join(_.map(exts.toArray(), extFormatter), ', ')}`);
        });
    }
}
