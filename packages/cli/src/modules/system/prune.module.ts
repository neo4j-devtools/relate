import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider, ENVIRONMENT_TYPES} from '@relate/common';
import cli from 'cli-ux';
import {bold} from 'chalk';

import PruneCommand from '../../commands/system/prune';
import {confirmPrompt} from '../../prompts';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class PruneModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof PruneCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {yes} = this.parsed.flags;

        const envs = await this.systemProvider.listEnvironments();

        for (const env of envs) {
            const tree = cli.tree();
            this.utils.log(bold(`${env.name} (${env.type.toLowerCase()})`));

            if (env.type === ENVIRONMENT_TYPES.LOCAL) {
                // Only local data is being deleted, so there's no need to display remote data.
                tree.insert('dbmss');
                tree.insert('extensions');
                tree.insert('projects');
                tree.insert('backups');

                // eslint-disable-next-line no-await-in-loop
                const [dbmss, extensions, projects, backups] = await Promise.all([
                    env.dbmss.list(),
                    env.extensions.list(),
                    env.projects.list(),
                    env.backups.list(),
                ]);

                dbmss.forEach((dbms) => tree.nodes.dbmss.insert(dbms.name));
                extensions.forEach((ext) => tree.nodes.extensions.insert(ext.name));
                projects.forEach((project) => tree.nodes.projects.insert(project.name));
                backups.forEach((backup) => tree.nodes.backups.insert(backup.name));
            }

            tree.display();
        }

        this.utils.log('All configuration, data and cache will be deleted.');
        this.utils.log('This includes DBMSs, environments, projects, extensions and backups.');
        this.utils.log('Above you can find a list of the data that will be deleted.');
        const confirmed = yes || (await confirmPrompt('Do you wish to proceed?'));
        this.utils.log('\n');

        if (!confirmed) {
            this.utils.log('Action cancelled');
            return;
        }

        // @todo delete data
        this.utils.log('Done');
    }
}
