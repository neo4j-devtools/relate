import Command from '@oclif/command';
import parser from '@oclif/parser';
import {CLIError} from '@oclif/errors';
import {INestApplicationContext, Type} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {SystemModule, EXTENSION_TYPES, loadExtensionsFor} from '@relate/common';

import {IS_DEVELOPMENT_ENV, IS_TEST_ENV} from './constants';

const dynamicModules = loadExtensionsFor(EXTENSION_TYPES.CLI);

export default abstract class BaseCommand extends Command {
    protected abstract commandClass: parser.Input<parser.flags.Output>;

    // Any nestjs module should be a valid command module.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected abstract commandModule: Type<any>;

    run(): Promise<INestApplicationContext> {
        const parsed = this.parse(this.commandClass);
        const utils = {
            debug: this.debug,
            error: this.error,
            log: this.log,
            exit: this.exit,
        };

        const options = IS_DEVELOPMENT_ENV ? {} : {logger: false};

        return NestFactory.createApplicationContext(
            {
                imports: [SystemModule, ...dynamicModules],
                module: this.commandModule,
                providers: [
                    {
                        provide: 'PARSED_PROVIDER',
                        useValue: parsed,
                    },
                    {
                        provide: 'UTILS_PROVIDER',
                        useValue: utils,
                    },
                ],
            },
            options,
        ).catch((err) => {
            // When exiting with Ctrl-C an undefined error is thrown, oclif is
            // supposed to hide it, but it still shows for some reason.
            if (!err) {
                this.exit(0);
            }

            if (IS_DEVELOPMENT_ENV || IS_TEST_ENV) {
                throw err;
            }

            if (!('oclif' in err)) {
                // If passed a generic error object, wrap it in CLIError to show the full stack trace
                // even when not in debug mode. If it's passed a message it will display
                // the error message nicely to the user, and if debug mode is enabled
                // it will display the stack trace too.
                const cliError = new CLIError(err.message);
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                cliError.name = err.name;
                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                // @ts-ignore
                cliError.stack = err.stack;
                throw cliError;
            } else {
                throw err;
            }
        });
    }
}
