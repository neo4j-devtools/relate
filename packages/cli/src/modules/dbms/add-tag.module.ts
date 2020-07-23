import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';

import {inputPrompt, selectDbmsPrompt} from '../../prompts';
import {isInteractive} from '../../stdin';
import AddTagCommand from '../../commands/dbms/add-tag';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class AddTagModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof AddTagCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        let {tagName, dbms: dbmsId} = args;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);

        if (!dbmsId && isInteractive()) {
            dbmsId = await selectDbmsPrompt('Select a DBMS', environment);
        }

        const dbms = await environment.dbmss.get(dbmsId);
        tagName = tagName || (await inputPrompt('Enter tag to add'));

        await environment.dbmss.addTags(dbms.id, [tagName]).then((res) => {
            this.utils.log(res.tags.join(', '));
        });
    }
}
