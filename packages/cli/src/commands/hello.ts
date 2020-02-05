import {flags} from '@oclif/command';

import {HelloModule} from '../modules/hello.module';
import BaseCommand from '../base.command';

export interface IHelloFlags {
    force: boolean;
    help: void;
    name?: string;
}

export default class Hello extends BaseCommand {
    commandClass = Hello;

    commandModule = HelloModule;

    static description = 'describe the command here';

    static examples = [
        `$ relate hello
hello world from ./src/hello.ts!
`,
    ];

    static flags = {
        // flag with no value (-f, --force)
        force: flags.boolean({char: 'f'}),
        help: flags.help({char: 'h'}),
        // flag with a value (-n, --name=VALUE)
        name: flags.string({
            char: 'n',
            description: 'name to print',
        }),
    };

    static args = [{name: 'file'}];
}
