import {Flags} from '@oclif/core';
import BaseCommand from '../../base.command';
import {REQUIRED_FOR_SCRIPTS} from '../../constants';
import {LinkModule} from '../../modules/project/link.module';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link a project';

    static examples = ['$ relate project:link /path/to/target/project/dir'];

    static args = [
        {
            name: 'filePath',
            required: true,
        },
    ];

    static flags = {
        name: Flags.string({
            char: 'n',
            description: 'Name of the project',
            required: REQUIRED_FOR_SCRIPTS,
        }),
    };
}
