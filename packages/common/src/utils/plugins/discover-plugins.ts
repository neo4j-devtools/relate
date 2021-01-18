import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import {Dict, List} from '@relate/types';

import {IPluginSource, IPluginVersion, PluginSourceModel, PluginVersionModel} from '../../models';
import {isArray} from 'lodash';

export const discoverPluginSources = async (rootDir: string): Promise<Record<string, IPluginSource>> => {
    const sources = await List.from(await fse.readdir(rootDir))
        .filter((filename) => filename.endsWith('.json'))
        .mapEach(async (filename) => {
            const filepath = path.join(rootDir, filename);
            const pluginSource = await fse.readJSON(filepath);

            return new PluginSourceModel(pluginSource);
        })
        .unwindPromises();

    return Dict.from(sources.mapEach((source): [string, IPluginSource] => [source.name, source])).toObject();
};

export const fetchPluginVersions = async (versionsUrl: string): Promise<List<IPluginVersion> | null> => {
    const response = await got(versionsUrl)
        .json()
        .catch(() => null);

    if (!isArray(response)) {
        return null;
    }

    return List.of(response).mapEach((version) => new PluginVersionModel(version));
};
