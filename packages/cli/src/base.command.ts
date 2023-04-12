import {Command, Interfaces, Errors} from '@oclif/core';
import {INestApplicationContext, Type} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {ISystemModuleConfig, SystemModule, registerHookListener, HOOK_EVENTS} from '@relate/common';
import {ConfigModule} from '@nestjs/config';

import {IS_DEVELOPMENT_ENV, IS_TEST_ENV} from './constants';

export default abstract class BaseCommand extends Command {
    protected abstract commandClass: Interfaces.Input<Interfaces.FlagOutput, Interfaces.FlagOutput>;

    // Any nestjs module should be a valid command module.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected abstract commandModule: Type<any>;

    static flags = {};

    static globalFlags = {};

    async run(): Promise<INestApplicationContext> {
        const parsed = await this.parse(this.commandClass);
        const utils = {
            debug: this.debug.bind(this),
            error: this.error.bind(this),
            log: this.log.bind(this),
            exit: this.exit.bind(this),
            warn: this.warn.bind(this),
        };
        const options: {logger?: false} = IS_DEVELOPMENT_ENV ? {} : {logger: false};
        const {flags} = parsed;
        const systemConfig: ISystemModuleConfig = {defaultEnvironmentNameOrId: flags.environment};

        registerHookListener(HOOK_EVENTS.DEBUG, (msg) => this.debug(msg));

        return NestFactory.createApplicationContext(
            {
                imports: [
                    ConfigModule.forRoot({
                        isGlobal: true,
                        load: [() => systemConfig],
                    }),
                    SystemModule,
                ],
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
                const cliError = new Errors.CLIError(err.message);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                cliError.name = err.name;
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                cliError.stack = err.stack;
                throw cliError;
            } else {
                throw err;
            }
        });
    }
}
