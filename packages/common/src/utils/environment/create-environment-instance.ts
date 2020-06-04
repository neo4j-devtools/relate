import {Dict} from '@relate/types';

import {EnvironmentConfigModel} from '../../models';
import {InvalidConfigError} from '../../errors';
import {EnvironmentAbstract, RemoteEnvironment, LocalEnvironment, ENVIRONMENT_TYPES} from '../../environments';

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
            throw new InvalidConfigError(`Environment type ${config.type} not supported`, [
                `The supported Environment types are: ${Dict.from(ENVIRONMENT_TYPES).values.join(', ')}`,
            ]);
    }

    await environment.init();
    return environment;
}
