import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {ISampleProjectRest, SystemModule, SystemProvider} from '@relate/common';
import chalk from 'chalk';
import cli from 'cli-ux';
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

        cli.table(
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

        cli.action.start(`Downloading '${selected}'.`);
        const {path: downloadPath, temp} = await environment.projects.downloadSampleProject(
            item.downloadUrl,
            selected,
            destPath,
        );
        cli.action.stop(chalk.green('done'));

        cli.action.start(`Creating project '${selected}'.`);
        const manifests = await environment.projects.installSampleProject(downloadPath, {
            name: selected,
            temp,
        });
        cli.action.stop(chalk.green('done'));

        if (manifests?.install?.dbms) {
            for (const dbms of manifests.install.dbms) {
                dbms.name = dbms.name || manifests.install.name;

                this.utils.log(' ');
                this.utils.log(
                    chalk.cyan(`We found install instructions for '${dbms.name}, ${dbms.targetNeo4jVersion}'.`),
                );

                /* eslint-disable no-await-in-loop */
                const selection = await confirmPrompt('Do you want to install this?');
                if (selection) {
                    this.utils.log(' ');
                    /* eslint-disable no-await-in-loop */
                    const credentials = await passwordPrompt('Enter new passphrase');

                    cli.action.start(`Creating '${dbms.name}' DBMS and importing data`);
                    /* eslint-disable no-await-in-loop */
                    const {created} = await environment.projects.importSampleDbms(
                        manifests.project.id,
                        dbms,
                        credentials,
                    );
                    cli.action.stop(chalk.green('done'));

                    if (created) {
                        this.utils.log(chalk.green(`Successfully created ${created.name}.`));
                    }
                }
            }
        }
    }
}
