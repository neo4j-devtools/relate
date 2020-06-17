import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';

import {SystemProvider} from '@relate/common';

@Injectable()
export class EnvironmentGuard implements CanActivate {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const {fieldName} = ctx.getInfo();
        const {environmentNameOrId} = ctx.getArgs();
        const environment = await this.systemProvider.getEnvironment(environmentNameOrId);

        return environment.supports(fieldName);
    }
}
