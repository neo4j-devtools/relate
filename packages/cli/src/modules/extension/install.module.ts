import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';

import InstallCommand from '../../commands/extension/install';

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

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {name} = args;
        let {version} = flags;

        const pathVersion = version && path.resolve(version);

        if (pathVersion && (await fse.pathExists(pathVersion))) {
            version = pathVersion;
        }

        return this.systemProvider.installExtension(name, version).then((res) => {
            this.utils.log(res.name);
        });
    }
}
