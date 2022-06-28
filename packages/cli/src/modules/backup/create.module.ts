import {OnApplicationBootstrap, Module, Inject} from '@nestjs/common';
import {CliUx} from '@oclif/core';
import {SystemModule, SystemProvider} from '@relate/common';

import CreateCommand from '../../commands/backup/create';
import {selectPrompt, selectEntityPrompt} from '../../prompts';
import {VALID_BACKUP_TYPES} from '../../constants';
import {getEntityDisplayName} from '../../utils/display.utils';
import {getSelectedEntity} from '../../utils/entity.utils';

@Module({
    exports: [],
    imports: [SystemModule],
    providers: [],
})
export class CreateModule implements OnApplicationBootstrap {
    constructor(
        @Inject('PARSED_PROVIDER')
        protected readonly parsed: ParsedInput<typeof CreateCommand>,
        @Inject('UTILS_PROVIDER') protected readonly utils: CommandUtils,
        @Inject(SystemProvider) protected readonly systemProvider: SystemProvider,
    ) {}

    async onApplicationBootstrap(): Promise<void> {
        const {args, flags} = this.parsed;
        const {environment: environmentId} = flags;
        const environment = await this.systemProvider.getEnvironment(environmentId);
        let {entityNameOrId} = args;
        const entityType = flags.type || (await selectPrompt('Select entity type to backup', VALID_BACKUP_TYPES));

        if (!entityNameOrId) {
            entityNameOrId = await selectEntityPrompt(`Select ${entityType} to backup`, environment, entityType);
        }

        const entity = await getSelectedEntity(environment, entityType, entityNameOrId);

        CliUx.ux.action.start(`Creating backup for ${getEntityDisplayName(entity)}`);
        await environment.backups.create(entityType, entity.id);
        CliUx.ux.action.stop();
    }
}
