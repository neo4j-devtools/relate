import {EnvironmentConfigModel} from '../../models';
import {InvalidConfigError} from '../../errors';

import {EnvironmentAbstract, RemoteEnvironment, LocalEnvironment, ENVIRONMENT_TYPES} from '../../entities/environments';

export async function createEnvironmentInstance(config: EnvironmentConfigModel): Promise<EnvironmentAbstract> {
    let environment: EnvironmentAbstract;
    switch (config.type) {
        case ENVIRONMENT_TYPES.LOCAL:
            environment = new LocalEnvironment(config);
            break;
        case ENVIRONMENT_TYPES.REMOTE:
            environment = new RemoteEnvironment(config);
            break;
        default:
            throw new InvalidConfigError(`Environment type ${config.type} not supported`);
    }

    await environment.init();
    return environment;
}
