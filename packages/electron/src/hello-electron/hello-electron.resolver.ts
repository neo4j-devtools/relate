import {Query, Resolver} from '@nestjs/graphql';

@Resolver(() => String)
export class HelloElectronResolver {
    @Query(() => String)
    getElectronHello(): string {
        return 'Hello electron';
    }
}
