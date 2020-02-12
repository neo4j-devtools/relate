import {Query, Resolver} from '@nestjs/graphql';
import {Inject} from '@nestjs/common';
import {HelloService} from '@relate/common';

@Resolver(() => String)
export class HelloResolver {
    constructor(@Inject(HelloService) private readonly helloService: HelloService) {}

    @Query(() => String)
    getHello(): string {
        return this.helloService.getHello();
    }

    @Query(() => String)
    getGoodbye(): string {
        return this.helloService.getGoodbye();
    }
}
