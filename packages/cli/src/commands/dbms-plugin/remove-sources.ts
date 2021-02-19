import BaseCommand from '../../base.command';
import {FLAGS} from '../../constants';
import {RemoveSourcesModule} from '../../modules/dbms-plugin/remove-sources.module';

export default class RemoveSourcesCommand extends BaseCommand {
    commandClass = RemoveSourcesCommand;

    commandModule = RemoveSourcesModule;

    static description = 'Remove one or more plugin sources';

    static aliases = ['plugin:remove-sources'];

    static examples = [
        '$ relate dbms-plugin:remove-sources',
        '$ relate dbms-plugin:remove-sources -e environment-name',
        '$ relate dbms-plugin:remove-sources sourceName',
        '$ relate dbms-plugin:remove-sources sourceName1 sourceName2',
    ];

    static strict = false;

    static args = [
        {
            name: 'sources',
            description: 'Names of the plugin sources to remove',
        },
    ];

    static flags = {
        ...FLAGS.ENVIRONMENT,
    };
}
