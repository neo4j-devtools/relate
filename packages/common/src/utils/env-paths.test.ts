import path from 'path';

import {EnvPaths, linux, macOS, windows} from './env-paths';

jest.mock('os', () => ({
    homedir: (): string => '$HOME',
    tmpdir: (): string => '$TMP',
}));

describe('envPaths', () => {
    const originalEnvs = process.env;

    beforeEach(() => {
        process.env = {};
    });

    afterAll(() => {
        process.env = originalEnvs;
    });

    test('system defaults', () => {
        const expectedMacOS = {
            cache: path.normalize('$HOME/Library/Caches/com.Neo4j.Relate'),
            config: path.normalize('$HOME/Library/Application Support/com.Neo4j.Relate/Config'),
            data: path.normalize('$HOME/Library/Application Support/com.Neo4j.Relate/Data'),
            tmp: path.normalize('$TMP/com.Neo4j.Relate'),
        };
        const expectedLinux = {
            cache: path.normalize('$HOME/.cache/neo4j-relate'),
            config: path.normalize('$HOME/.config/neo4j-relate'),
            data: path.normalize('$HOME/.local/share/neo4j-relate'),
            tmp: path.normalize('$TMP/neo4j-relate'),
        };
        const expectedWindows = {
            cache: path.normalize('$HOME/AppData/Local/Neo4j/Relate/Cache'),
            config: path.normalize('$HOME/AppData/Roaming/Neo4j/Relate/Config'),
            data: path.normalize('$HOME/AppData/Local/Neo4j/Relate/Data'),
            tmp: path.normalize('$TMP/Neo4j/Relate'),
        };

        expect(macOS()).toEqual(expectedMacOS);
        expect(linux()).toEqual(expectedLinux);
        expect(windows()).toEqual(expectedWindows);
    });
    test('app overrides', () => {
        const expected = (name: string): EnvPaths => ({
            cache: path.normalize('/Custom/Application/Cache/Path'),
            config: path.normalize('/Custom/Application/Config/Path'),
            data: path.normalize('/Custom/Application/Data/Path'),
            tmp: path.normalize(`$TMP/${name}`),
        });

        process.env = {
            APPDATA: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            LOCALAPPDATA: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            NEO4J_RELATE_CACHE_HOME: path.normalize('/Custom/Application/Cache/Path'),
            NEO4J_RELATE_CONFIG_HOME: path.normalize('/Custom/Application/Config/Path'),
            NEO4J_RELATE_DATA_HOME: path.normalize('/Custom/Application/Data/Path'),
            XDG_CACHE_HOME: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            XDG_CONFIG_HOME: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            XDG_DATA_HOME: '/System/Overrides/Shouldnt/Affect/App/Overrides',
        };

        expect(macOS()).toEqual(expected('com.Neo4j.Relate'));
        expect(linux()).toEqual(expected('neo4j-relate'));
        expect(windows()).toEqual(expected('Neo4j/Relate'));
    });
    test('system overrides', () => {
        const expected = (name: string): EnvPaths => ({
            cache: path.normalize(`/Custom/System/Cache/Path/${name}`),
            config: path.normalize(`/Custom/System/Config/Path/${name}`),
            data: path.normalize(`/Custom/System/Data/Path/${name}`),
            tmp: path.normalize(`$TMP/${name}`),
        });

        process.env = {
            APPDATA: path.normalize('/Windows/Custom/AppData/Roaming'),
            LOCALAPPDATA: path.normalize('/Windows/Custom/AppData/Local'),
            XDG_CACHE_HOME: '/Custom/System/Cache/Path',
            XDG_CONFIG_HOME: '/Custom/System/Config/Path',
            XDG_DATA_HOME: '/Custom/System/Data/Path',
        };

        expect(macOS()).toEqual(expected('com.Neo4j.Relate'));
        expect(linux()).toEqual(expected('neo4j-relate'));
        expect(windows()).toEqual({
            cache: path.normalize(`/Windows/Custom/AppData/Local/Neo4j/Relate/Cache`),
            config: path.normalize(`/Windows/Custom/AppData/Roaming/Neo4j/Relate/Config`),
            data: path.normalize(`/Windows/Custom/AppData/Local/Neo4j/Relate/Data`),
            tmp: path.normalize(`$TMP/Neo4j/Relate`),
        });
    });
});
