import fse from 'fs-extra';
import got from 'got';
import path from 'path';
import {List} from '@relate/types';
import {isArray, isObject} from 'lodash';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel, DbmsPluginVersionModel} from '../../models';
import {NEO4J_PLUGIN_SOURCES_URL} from '../../entities/environments';

export const fetchOfficialPluginSources = async (): Promise<List<IDbmsPluginSource>> => {
    const rawSourcesMap = await got(NEO4J_PLUGIN_SOURCES_URL)
        .json()
        .catch(() => null);

    if (!rawSourcesMap || !isObject(rawSourcesMap)) {
        // @todo - should we check the cache here before returning an empty list?
        return List.from([]);
    }

    return List.from(Object.entries(rawSourcesMap)).mapEach(([name, source]) => {
        return new DbmsPluginSourceModel({
            ...source,
            name,
            isOfficial: true,
        });
    });
};

export const discoverPluginSources = async (rootDir: string): Promise<List<IDbmsPluginSource>> => {
    const sourcesFiles = await fse.readdir(rootDir);
    const sourcesList = await List.from(sourcesFiles)
        .filter((filename) => filename.endsWith('.json'))
        .mapEach(async (filename) => {
            const filepath = path.join(rootDir, filename);
            const pluginSource = await fse.readJSON(filepath);

            return new DbmsPluginSourceModel(pluginSource);
        })
        .unwindPromises();

    return sourcesList;
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
