import {Module, OnModuleInit, Inject, DynamicModule} from '@nestjs/common';

import {IHelloFlags} from '../commands/hello';

@Module({})
export class HelloModule implements OnModuleInit {
    constructor(
        @Inject('PARSED_PROVIDER') private readonly parsed: ParsedInput<IHelloFlags>,
        @Inject('UTILS_PROVIDER') private readonly utils: CommandUtils,
    ) {}

    static forRoot(parsed: ParsedInput<IHelloFlags>, utils: CommandUtils): DynamicModule {
        return {
            module: HelloModule,
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
        };
    }

    onModuleInit() {
        this.utils.log(`Hello ${this.parsed.args.file}`);
    }
}
