import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/extension/link.module';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static description = 'Link an extension (useful for development)';

    static args = [{name: 'filePath'}];
}
