import BaseCommand from '../../base.command';
import {LinkModule} from '../../modules/extension/link.module';

export default class LinkCommand extends BaseCommand {
    commandClass = LinkCommand;

    commandModule = LinkModule;

    static aliases = ['ext:link'];

    static description = 'Link a Relate extension.\nUseful for development.';

    static examples = ['$ relate ext:link file/path/to/extension'];

    static args = [{name: 'filePath'}];
}
