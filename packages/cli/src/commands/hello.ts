import {Command, flags} from '@oclif/command';
import {NestFactory} from '@nestjs/core';

import {HelloModule} from '../modules/hello.module';
import {IS_TESTING_ENV} from '../constants';
import {INestApplicationContext} from '@nestjs/common';

export interface IHelloFlags {
    help: void;
    name?: string;
    force: boolean;
}

export default class Hello extends Command {
    static description = 'describe the command here';

    static examples = [
        `$ daedalus hello
hello world from ./src/hello.ts!
`,
    ];

    static flags: flags.Input<IHelloFlags> = {
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

    run(): Promise<INestApplicationContext> {
        const parsed = this.parse(Hello);
        const utils = {
            debug: this.debug,
            log: this.log,
        };
        const options = IS_TESTING_ENV ? {logger: false} : {};

        return NestFactory.createApplicationContext(HelloModule.forRoot(parsed, utils), options);
    }
}
