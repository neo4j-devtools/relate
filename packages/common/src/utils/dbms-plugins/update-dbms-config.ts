import {Dict, List} from '@relate/types';
import {DbmsPluginConfig} from '../../models';
import {PropertiesFile} from '../../system';

function parsePluginConfigKey(change: string, configChanges: DbmsPluginConfig) {
    const parts = change.split(':');
    const [modifier, property] = parts.length === 1 ? ['', parts[0]] : parts;

    return {
        raw: change,
        property,
        modifier,
        value: configChanges[change],
    };
}

export function updateDbmsConfig(config: PropertiesFile, configChanges: DbmsPluginConfig): void {
    const properties = Dict.from(configChanges).keys;
    properties
        .mapEach((change) => parsePluginConfigKey(change, configChanges))
        .forEach((change) => {
            if (!change.value) {
                return;
            }

            switch (change.modifier) {
                case '':
                case '+': {
                    if (typeof change.value === 'string') {
                        config.set(change.property, change.value);
                        return;
                    }

                    const currentValue = (config.get(change.property) || '').split(',');
                    const newValue = List.from(currentValue)
                        .concat(change.value)
                        .filter(Boolean)
                        .unique()
                        .join(',')
                        .toString();
                    config.set(change.property, newValue);
                    break;
                }
                case '+?': {
                    break;
                }
                case '-': {
                    if (!config.get(change.property)) {
                        return;
                    }

                    if (typeof change.value === 'boolean') {
                        config.set(change.property, '');
                        return;
                    }

                    if (typeof change.value === 'string') {
                        const currentValue = config.get(change.property);
                        if (currentValue === change.value) {
                            config.set(change.property, '');
                        }
                        return;
                    }

                    const currentValues = (config.get(change.property) || '').split(',');
                    const valuesToRemove = change.value;
                    const newValue = List.from(currentValues)
                        .filter((val) => !valuesToRemove.includes(val))
                        .join(',')
                        .toString();
                    config.set(change.property, newValue);
                    break;
                }
                case '-?': {
                    break;
                }
                default:
            }
        });
}
