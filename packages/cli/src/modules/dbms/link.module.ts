import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {SystemModule, SystemProvider} from '@relate/common';
import path from 'path';

import LinkCommand from '../../commands/dbms/link';
import {RequiredArgsError} from '../../errors';
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
        const {filePath} = args;
        const {yes} = flags;
        const name = flags.name || (await inputPrompt('Enter the DBMS name'));

        if (!filePath) {
            // @todo: figure this out in combination with TTY
            throw new RequiredArgsError(['filepath']);
        }

        if (
            !yes &&
            isInteractive() &&
            !(await confirmPrompt(
                `Linking a DBMS will update its configuration file (neo4j.conf), do you wish to proceed?`,
            ))
        ) {
            this.utils.log('Aborted by user');
        }

        if (!isInteractive() && !yes) {
            this.utils.error('Did not confirm DBMS configuration file (neo4j.conf) changes');
        }

        const {dbmss} = await this.systemProvider.getEnvironment();
        const resolvedPath = path.resolve(filePath);

        return dbmss.link(name, resolvedPath).then((res) => {
            this.utils.log(res.name);
        });
    }
}
