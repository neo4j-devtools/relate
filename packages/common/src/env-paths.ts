/**
 * This utility returns the directories where the application should store
 * information. These paths can be overridden by the user either globally
 * using the XDG base dir environment variables, or just for our application
 * using our environment variables.
 *
 * The priority of these environment variables is the following:
 *
 * Mac & Linux: NEO4J_RELATE_*_HOME > XDG_*_HOME > System defaults
 * Windows: NEO4J_RELATE_*_HOME > APPDATA & LOCALAPPDATA > System defaults
 *
 * Docs:
 * - MacOS: https://developer.apple.com/library/archive/documentation/FileManagement/Conceptual/FileSystemProgrammingGuide/FileSystemOverview/FileSystemOverview.html#//apple_ref/doc/uid/TP40010672-CH2-SW1
 * - Windows: https://docs.microsoft.com/en-us/windows/uwp/design/app-settings/store-and-retrieve-app-data
 * - Linux: https://specifications.freedesktop.org/basedir-spec/latest/
 */

import path from 'path';
import os from 'os';

export type EnvPaths = {
    cache: string;
    config: string;
    data: string;
    tmp: string;
};

type Overrides = {
    cache: string | undefined;
    config: string | undefined;
    data: string | undefined;
};

const homedir = os.homedir();
const tmpdir = os.tmpdir();

const getOverrides = (): {app: Overrides; system: Overrides} => {
    const {env} = process;

    return {
        app: {
            cache: env.NEO4J_RELATE_CACHE_HOME,
            config: env.NEO4J_RELATE_CONFIG_HOME,
            data: env.NEO4J_RELATE_DATA_HOME,
        },
        system: {
            cache: env.XDG_CACHE_HOME,
            config: env.XDG_CONFIG_HOME,
            data: env.XDG_DATA_HOME,
        },
    };
};

export const macOS = (): EnvPaths => {
    const {app, system} = getOverrides();
    const name = 'com.Neo4j.Relate';

    const systemFullPaths = {
        cache: system.cache && path.join(system.cache, name),
        config: system.config && path.join(system.config, name),
        data: system.data && path.join(system.data, name),
    };

    const defaults = {
        cache: path.join(homedir, 'Library', 'Caches', name),
        config: path.join(homedir, 'Library', 'Application Support', name, 'Config'),
        data: path.join(homedir, 'Library', 'Application Support', name, 'Data'),
    };

    return {
        cache: app.cache || systemFullPaths.cache || defaults.cache,
        config: app.config || systemFullPaths.config || defaults.config,
        data: app.data || systemFullPaths.data || defaults.data,
        tmp: path.join(tmpdir, name),
    };
};

export const windows = (): EnvPaths => {
    const {app} = getOverrides();
    const name = path.join('Neo4j', 'Relate');

    const appData = process.env.APPDATA || path.join(homedir, 'AppData', 'Roaming');
    const localAppData = process.env.LOCALAPPDATA || path.join(homedir, 'AppData', 'Local');

    const defaults = {
        cache: path.join(localAppData, name, 'Cache'),
        config: path.join(appData, name, 'Config'),
        data: path.join(localAppData, name, 'Data'),
    };

    return {
        cache: app.cache || defaults.cache,
        config: app.config || defaults.config,
        data: app.data || defaults.data,
        tmp: path.join(tmpdir, name),
    };
};

export const linux = (): EnvPaths => {
    const {app, system} = getOverrides();
    const name = 'neo4j-relate';

    const defaults = {
        cache: path.join(homedir, '.cache'),
        config: path.join(homedir, '.config'),
        data: path.join(homedir, '.local', 'share'),
    };

    return {
        cache: app.cache || path.join(system.cache || defaults.cache, name),
        config: app.config || path.join(system.config || defaults.config, name),
        data: app.data || path.join(system.data || defaults.data, name),
        tmp: path.join(tmpdir, name),
    };
};

export const envPaths = (): EnvPaths => {
    if (process.platform === 'darwin') {
        return macOS();
    }

    if (process.platform === 'win32') {
        return windows();
    }

    return linux();
};
