import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import {Dict, List} from '@relate/types';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel, DbmsPluginVersionModel} from '../../models';
import {isArray} from 'lodash';

export const discoverPluginSources = async (rootDir: string): Promise<Record<string, IDbmsPluginSource>> => {
    const sources = await List.from(await fse.readdir(rootDir))
        .filter((filename) => filename.endsWith('.json'))
        .mapEach(async (filename) => {
            const filepath = path.join(rootDir, filename);
            const pluginSource = await fse.readJSON(filepath);

            return new DbmsPluginSourceModel(pluginSource);
        })
        .unwindPromises();

    return Dict.from(sources.mapEach((source): [string, IDbmsPluginSource] => [source.name, source])).toObject();
};

export const fetchPluginVersions = async (versionsUrl: string): Promise<List<IDbmsPluginVersion> | null> => {
    const response = await got(versionsUrl)
        .json()
        .catch(() => null);

    if (!isArray(response)) {
        return null;
    }

    return List.of(response).mapEach((version) => new DbmsPluginVersionModel(version));
};
