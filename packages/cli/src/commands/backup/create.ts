import {Args, Flags} from '@oclif/core';
import {ENTITY_TYPES} from '@relate/common';

import BaseCommand from '../../base.command';
import {FLAGS, REQUIRED_FOR_SCRIPTS, VALID_BACKUP_TYPES} from '../../constants';
import {CreateModule} from '../../modules/backup/create.module';

export default class CreateCommand extends BaseCommand {
    commandClass = CreateCommand;

    commandModule = CreateModule;

    static description = 'Create a new resource backup';

    static examples = [
        '$ relate backup:create',
        '$ relate backup:create -e environment-name',
        '$ relate backup:create <entity-id> -t dbms',
    ];

    static args = {
        entityNameOrId: Args.string({
            description: 'Entity id',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };

    static flags = {
        ...FLAGS.ENVIRONMENT,
        type: Flags.custom<ENTITY_TYPES>({
            char: 't',
            options: VALID_BACKUP_TYPES,
            description: 'The relate entity type',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
