import _ from 'lodash';
import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
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

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        const name = flags.name || (await inputPrompt('Enter the DBMS name'));

        let {version = ''} = args;
        if (!version) {
            let versions = await environment.listDbmsVersions();
            versions = _.compact(_.map(versions, (version) => {
                if (version.origin === 'cached') {
                    return version
                }
                const cachedVersionExists = _.find(versions, (ver) => ver.origin === 'cached' && ver.version === version.version && ver.edition === version.edition);
                if (!cachedVersionExists) {
                    return version
                }
            }));
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

        cli.action.start('Installing DBMS');
        return environment.installDbms(name, credentials, version).then((res) => {
            cli.action.stop();
            this.utils.log(res);
        });
    }
}
