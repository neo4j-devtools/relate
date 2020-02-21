import {macOS, linux, windows, EnvPaths} from './env-paths';

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
            cache: '$HOME/Library/Caches/com.Neo4j.Relate',
            config: '$HOME/Library/Application Support/com.Neo4j.Relate/Config',
            data: '$HOME/Library/Application Support/com.Neo4j.Relate/Data',
            tmp: '$TMP/com.Neo4j.Relate',
        };
        const expectedLinux = {
            cache: '$HOME/.cache/neo4j-relate',
            config: '$HOME/.config/neo4j-relate',
            data: '$HOME/.local/share/neo4j-relate',
            tmp: '$TMP/neo4j-relate',
        };
        const expectedWindows = {
            cache: '$HOME/AppData/Local/Neo4j/Relate/Cache',
            config: '$HOME/AppData/Roaming/Neo4j/Relate/Config',
            data: '$HOME/AppData/Local/Neo4j/Relate/Data',
            tmp: '$TMP/Neo4j/Relate',
        };

        expect(macOS()).toEqual(expectedMacOS);
        expect(linux()).toEqual(expectedLinux);
        expect(windows()).toEqual(expectedWindows);
    });
    test('app overrides', () => {
        const expected = (name: string): EnvPaths => ({
            cache: '/Custom/Application/Cache/Path',
            config: '/Custom/Application/Config/Path',
            data: '/Custom/Application/Data/Path',
            tmp: `$TMP/${name}`,
        });

        process.env = {
            APPDATA: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            LOCALAPPDATA: '/System/Overrides/Shouldnt/Affect/App/Overrides',
            NEO4J_RELATE_CACHE_HOME: '/Custom/Application/Cache/Path',
            NEO4J_RELATE_CONFIG_HOME: '/Custom/Application/Config/Path',
            NEO4J_RELATE_DATA_HOME: '/Custom/Application/Data/Path',
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
            cache: `/Custom/System/Cache/Path/${name}`,
            config: `/Custom/System/Config/Path/${name}`,
            data: `/Custom/System/Data/Path/${name}`,
            tmp: `$TMP/${name}`,
        });

        process.env = {
            APPDATA: '/Windows/Custom/AppData/Roaming',
            LOCALAPPDATA: '/Windows/Custom/AppData/Local',
            XDG_CACHE_HOME: '/Custom/System/Cache/Path',
            XDG_CONFIG_HOME: '/Custom/System/Config/Path',
            XDG_DATA_HOME: '/Custom/System/Data/Path',
        };

        expect(macOS()).toEqual(expected('com.Neo4j.Relate'));
        expect(linux()).toEqual(expected('neo4j-relate'));
        expect(windows()).toEqual({
            cache: `/Windows/Custom/AppData/Local/Neo4j/Relate/Cache`,
            config: `/Windows/Custom/AppData/Roaming/Neo4j/Relate/Config`,
            data: `/Windows/Custom/AppData/Local/Neo4j/Relate/Data`,
            tmp: `$TMP/Neo4j/Relate`,
        });
    });
});
