import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/project/link.module';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link a project (useful for development)';

    static examples = ['$ relate project:link /path/to/target/project/dir'];

    static args = [{name: 'filePath'}];
}
