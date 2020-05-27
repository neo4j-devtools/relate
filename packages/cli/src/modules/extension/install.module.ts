import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import path from 'path';
import fse from 'fs-extra';

import InstallCommand from '../../commands/extension/install';
import _ from 'lodash';
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

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {name} = args;
        let {version = ''} = flags;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!name || !version) {
            let versions = await environment.listExtensionVersions();

            versions = name ? _.filter(versions, (v) => v.name === name) : versions;

            const selected = await selectPrompt(
                'Select a version to install',
                versions.map((v) => ({
                    message: `[${v.origin.toLowerCase()}] ${v.name}@${v.version}`,
                    name: v.version,
                    // ridiculous
                    value: JSON.stringify(v),
                })),
            );
            const parsed = JSON.parse(selected);

            name = parsed.name;
            version = parsed.version;
        }

        const pathVersion = path.resolve(version);

        if (pathVersion && (await fse.pathExists(pathVersion))) {
            version = pathVersion;
        }

        return environment.installExtension(name, version).then((res) => {
            this.utils.log(res.name);
        });
    }
}
