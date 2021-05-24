import fse from 'fs-extra';
import path from 'path';
import {List} from '@relate/types';
import {isArray, isObject} from 'lodash';

import {IDbmsPluginSource, IDbmsPluginVersion, DbmsPluginSourceModel, DbmsPluginVersionModel} from '../../models';
import {NEO4J_PLUGIN_SOURCES_URL} from '../../entities/environments';
import {envPaths} from '../env-paths';
import {DEFAULT_PLUGIN_SOURCES_FILE, PLUGIN_SOURCES_DIR_NAME} from '../../constants';
import {requestJson} from '../download';

export const fetchOfficialPluginSources = async (): Promise<List<IDbmsPluginSource>> => {
    const cachedSourcesFile = path.join(envPaths().cache, PLUGIN_SOURCES_DIR_NAME, DEFAULT_PLUGIN_SOURCES_FILE);
    const rawSourcesMap = await requestJson(NEO4J_PLUGIN_SOURCES_URL).catch(() => null);

    if (!rawSourcesMap || !isObject(rawSourcesMap)) {
        if (await fse.pathExists(cachedSourcesFile)) {
            return List.from<IDbmsPluginSource>(await fse.readJSON(cachedSourcesFile)).mapEach(
                (source) => new DbmsPluginSourceModel(source),
            );
        }

        return List.from([]);
    }

    const sources = List.from(Object.entries(rawSourcesMap)).mapEach(([name, source]) => {
        return new DbmsPluginSourceModel({
            ...source,
            name,
            isOfficial: true,
        });
    });

    await fse.ensureFile(cachedSourcesFile);
    await fse.writeJSON(cachedSourcesFile, sources);

    return sources;
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
    const response = await requestJson(versionsUrl).catch(() => null);

    if (!isArray(response)) {
        return null;
    }

    return List.of(response).mapEach((version) => new DbmsPluginVersionModel(version));
};
