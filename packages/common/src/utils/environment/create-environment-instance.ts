import {EnvironmentConfigModel} from '../../models';
import {ENVIRONMENT_TYPES} from '../../environments/environment.constants';
import {InvalidConfigError} from '../../errors';

import {EnvironmentAbstract} from '../../environments/environment.abstract';
import {RemoteEnvironment} from '../../environments/remote.environment';
import {LocalEnvironment} from '../../environments/local.environment';

export async function createEnvironmentInstance(
    config: EnvironmentConfigModel,
    configPath: string,
): Promise<EnvironmentAbstract> {
    let environment: EnvironmentAbstract;
    switch (config.type) {
        case ENVIRONMENT_TYPES.LOCAL:
            environment = new LocalEnvironment(config, configPath);
            break;
        case ENVIRONMENT_TYPES.REMOTE:
            environment = new RemoteEnvironment(config, configPath);
            break;
        default:
            throw new InvalidConfigError(`Environment type ${config.type} not supported`);
    }

    await environment.init();
    return environment;
}
