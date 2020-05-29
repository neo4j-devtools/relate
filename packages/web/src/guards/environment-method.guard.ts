import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';

import {SystemProvider} from '@relate/common';

@Injectable()
export class EnvironmentMethodGuard implements CanActivate {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const {fieldName} = ctx.getInfo();
        const {environmentId} = ctx.getArgs();
        const environment = await this.systemProvider.getEnvironment(environmentId);

        return environment.supports(fieldName);
    }
}
