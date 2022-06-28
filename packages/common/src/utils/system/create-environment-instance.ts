import {Dict} from '@relate/types';

import {EnvironmentConfigModel} from '../../models';
import {InvalidConfigError} from '../../errors';

import {EnvironmentAbstract, LocalEnvironment, ENVIRONMENT_TYPES} from '../../entities/environments';

export async function createEnvironmentInstance(config: EnvironmentConfigModel): Promise<EnvironmentAbstract> {
    let environment: EnvironmentAbstract;
    switch (config.type) {
        case ENVIRONMENT_TYPES.LOCAL:
            environment = new LocalEnvironment(config);
            break;
        default:
            throw new InvalidConfigError(`Environment type ${config.type} not supported`, [
                `The supported Environment types are: ${Dict.from(ENVIRONMENT_TYPES).values.join(', ')}`,
            ]);
    }

    await environment.init();
    return environment;
}
