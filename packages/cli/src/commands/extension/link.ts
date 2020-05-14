import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/extension/link.module';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static args = [{name: 'filePath'}];
}
