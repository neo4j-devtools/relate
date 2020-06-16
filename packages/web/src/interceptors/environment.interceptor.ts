import {Injectable, NestInterceptor, ExecutionContext, CallHandler, Inject} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {SystemProvider} from '@relate/common';
import {Observable} from 'rxjs';

@Injectable()
export class EnvironmentInterceptor implements NestInterceptor {
    constructor(@Inject(SystemProvider) private readonly systemProvider: SystemProvider) {}

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const ctx = GqlExecutionContext.create(context);
        const {environmentId} = ctx.getArgs();
        const environment = await this.systemProvider.getEnvironment(environmentId);
        ctx.getContext().environment = environment;

        return next.handle();
    }
}
