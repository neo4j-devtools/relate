import Command from '@oclif/command';
import parser from '@oclif/parser';
import {INestApplicationContext, Type} from '@nestjs/common';
import {NestFactory} from '@nestjs/core';
import {IS_DEVELOPMENT_ENV} from './constants';

export default abstract class BaseCommand extends Command {
    protected abstract commandClass: parser.Input<any>;

    protected abstract commandModule: Type<any>;

    run(): Promise<INestApplicationContext> {
        const parsed = this.parse(this.commandClass);
        const utils = {
            debug: this.debug,
            error: this.error,
            log: this.log,
        };

        const options = IS_DEVELOPMENT_ENV ? {} : {logger: false};

        return NestFactory.createApplicationContext(
            {
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
        );
    }
}
