import {Inject, Module, OnApplicationBootstrap} from '@nestjs/common';
import {AuthTokenModel, HOOK_EVENTS, registerHookListener, SystemModule, SystemProvider} from '@relate/common';

import {selectDbmsPrompt, passwordPrompt, inputPrompt, selectProjectPrompt} from '../../prompts';
import AddDbmsCommand from '../../commands/project/add-dbms';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AddDbmsModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof AddDbmsCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const environment = await this.systemProvider.getEnvironment(flags.environment);
        const projectId = flags.project || (await selectProjectPrompt('Select a Project', environment));
        const project = await environment.projects.get(projectId);

        const dbmsId =
            args.dbms || (await selectDbmsPrompt('Select a DBMS to create an access token for', environment));
        const dbmsName = flags.name || (await inputPrompt('Enter the DBMS project name'));
        const principal = flags.user || (await inputPrompt('Enter a Neo4j DBMS user'));
        const credentials = await passwordPrompt('Enter passphrase');

        const dbms = await environment.dbmss.get(dbmsId);
        const authToken = new AuthTokenModel({
            credentials,
            principal,
            scheme: 'basic',
        });

        registerHookListener(HOOK_EVENTS.RUN_QUERY_RETRY, ({retry}) => {
            if (retry < 1) {
                return;
            }

            if (retry === 1) {
                this.utils.log('DBMS connection not available, retrying...');
                return;
            }

            this.utils.log('still retrying...');
        });

        return environment.dbmss
            .createAccessToken(project.id, dbms.id, authToken)
            .then((accessToken) => environment.projects.addDbms(project.id, dbmsName, dbms, principal, accessToken))
            .then(({name}) => this.utils.log(`Dbms ${name} added to project`));
    }
}
