import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {ISampleProjectDbms, ISampleProjectRest, SystemModule, SystemProvider} from '@relate/common';
import chalk from 'chalk';
import {CliUx} from '@oclif/core';
import path from 'path';

import InstallSampleCommand from '../../commands/project/install-sample';
import {passwordPrompt, selectPrompt, confirmPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class InstallSampleModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof InstallSampleCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {flags} = this.parsed;
        const {to} = flags;

        let destPath;
        if (to) {
            destPath = path.resolve(to);
        }

        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        const sampleProjects = await (await environment.projects.listSampleProjects()).toArray();

        CliUx.ux.table(
            sampleProjects,
            {
                name: {},
                description: {},
            },
            {
                printLine: this.utils.log,
                ...flags,
            },
        );

        this.utils.log(' ');

        const selected = await selectPrompt(
            'Select a sample project to install',
            sampleProjects.map((item: ISampleProjectRest) => ({
                message: `${item.name}`,
                name: `${item.name}`,
            })),
        );

        const item = sampleProjects.find((p) => p.name === selected);

        if (!item) {
            this.utils.error(`Something went wrong when trying to download '${selected}'`);
            return;
        }

        CliUx.ux.action.start(`Downloading '${selected}'.`);
        const {path: downloadPath, temp} = await environment.projects.downloadSampleProject(
            item.downloadUrl,
            selected,
            destPath,
        );
        CliUx.ux.action.stop(chalk.green('done'));

        CliUx.ux.action.start(`Creating project '${selected}'.`);
        const manifests = await environment.projects.prepareSampleProject(downloadPath, {
            name: selected,
            temp,
        });
        CliUx.ux.action.stop(chalk.green('done'));

        if (manifests?.install?.dbms) {
            this.utils.log(' ');
            this.utils.log(
                chalk.cyan(
                    `We found install instructions for:\n${manifests.install.dbms
                        .map(
                            (dbms) =>
                                `${chalk.bold(dbms.name || manifests.install?.name || 'Sample DBMS')}, ${chalk.bold(
                                    dbms.targetNeo4jVersion,
                                )}`,
                        )
                        .join('\n')}`,
                ),
            );
            const shouldInstall = await confirmPrompt(`Do you want do continue to the install steps?`);

            if (!shouldInstall) {
                return;
            }

            const installSampleDbms = async (dbms: ISampleProjectDbms) => {
                dbms.name = dbms.name || manifests.install?.name || 'Sample DBMS';

                this.utils.log(' ');

                const selection = await confirmPrompt(
                    `Do you want to install '${chalk.bold(dbms.name)}, ${chalk.bold(dbms.targetNeo4jVersion)}'.`,
                );
                if (selection) {
                    this.utils.log(' ');
                    const credentials = await passwordPrompt('Enter new passphrase');

                    CliUx.ux.action.start(`Creating '${dbms.name}' DBMS and importing data`);
                    const {created} = await environment.projects.importSampleDbms(
                        manifests.project.id,
                        dbms,
                        credentials,
                    );
                    CliUx.ux.action.stop(chalk.green('done'));

                    if (created) {
                        this.utils.log(chalk.green(`Successfully created ${created.name}.`));

                        if (dbms.plugins) {
                            await Promise.all(
                                dbms.plugins.map((plugin) =>
                                    environment.dbmsPlugins.install([created.id], plugin).then(() => {
                                        this.utils.log(`Plugin "${plugin}" was successfully installed.`);
                                    }),
                                ),
                            );
                        }
                    }
                }
            };

            manifests.install.dbms.reduce(async (previousPromise, dbms) => {
                await previousPromise;
                return installSampleDbms(dbms);
            }, Promise.resolve());
        }
    }
}
