import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import path from 'path';

import LinkCommand from '../../commands/dbms/link';
import {confirmPrompt, inputPrompt} from '../../prompts';
import {isInteractive} from '../../stdin';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class LinkModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER') protected readonly parsed: ParsedInput<typeof LinkCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {filePath, dbmsName} = args;
        const {confirm} = flags;
        const name = dbmsName || (await inputPrompt('Enter the DBMS name'));
        const showPrompt = isInteractive() && !confirm;
        /* eslint-disable indent */
        const didConfirm = showPrompt
            ? await confirmPrompt(
                  `Linking a DBMS will update its configuration file (neo4j.conf), do you wish to proceed?`,
              )
            : confirm;
        /* eslint-enable indent */

        if (!didConfirm) {
            this.utils.error('Did not confirm DBMS configuration file (neo4j.conf) changes');
            return;
        }

        const {dbmss} = await this.systemProvider.getEnvironment();
        const resolvedPath = path.resolve(filePath);

        await dbmss.link(name, resolvedPath).then((res) => {
            this.utils.log(res.name);
        });
    }
}
