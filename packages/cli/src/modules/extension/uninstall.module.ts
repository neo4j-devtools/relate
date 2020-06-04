import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {IExtensionMeta, SystemModule, SystemProvider} from '@relate/common';
import _ from 'lodash';

import UninstallCommand from '../../commands/extension/uninstall';

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
        const {extension: name} = args;
        const {environment: environmentId} = flags;

        const environment = await this.systemProvider.getEnvironment(environmentId);

        return environment.uninstallExtension(name).then((exts) => {
            // @todo: will we have more than 1 version installed? If so, will
            // need to pass in / select version to uninstall
            const extFormatter = (ext: IExtensionMeta): string => `${ext.name}@${ext.version}`;

            this.utils.log(`Uninstalled ${_.join(_.map(exts.toArray(), extFormatter), ', ')}`);
        });
    }
}
