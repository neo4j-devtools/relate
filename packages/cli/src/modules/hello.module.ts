import {Module, OnModuleInit, Inject} from '@nestjs/common';

import {IHelloFlags} from '../commands/hello';

@Module({})
export class HelloModule implements OnModuleInit {
    constructor(
        @Inject('PARSED_PROVIDER') private readonly parsed: ParsedInput<IHelloFlags>,
        @Inject('UTILS_PROVIDER') private readonly utils: CommandUtils,
    ) {}

    onModuleInit(): void {
        this.utils.log(`Hello ${this.parsed.args.file}`);
    }
}
