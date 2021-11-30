import {resolveDbms} from './resolve-dbms';
import {PropertiesFile} from '../../system/files';

describe('resolveDbms', () => {
    const dummyConf = new PropertiesFile([], 'nowhere');
    const dbmss = {
        c9992c2f: {
            config: dummyConf,
            connectionUri: 'neo4j://127.0.0.1:7687',
            description: '',
            isCustomPathInstallation: false,
            tags: [],
            metadata: {},
            id: 'c9992c2f',
            name: 'Unique Name',
        },
        e45a7499: {
            config: dummyConf,
            connectionUri: 'neo4j://127.0.0.1:7687',
            description: '',
            isCustomPathInstallation: false,
            tags: [],
            metadata: {},
            id: 'e45a7499',
            name: 'Ambiguous Name',
        },
        f2bdb05c: {
            config: dummyConf,
            connectionUri: 'neo4j://127.0.0.1:7687',
            description: '',
            isCustomPathInstallation: false,
            tags: [],
            metadata: {},
            id: 'f2bdb05c',
            name: 'Ambiguous Name',
        },
    };

    test('resolves dbms by ID', () => {
        expect(resolveDbms(dbmss, 'f2bdb05c')).toEqual(dbmss.f2bdb05c);
    });

    test('resolves dbms by name', () => {
        expect(resolveDbms(dbmss, 'Unique Name')).toEqual(dbmss.c9992c2f);
    });

    test('throws on non existing name or ID', () => {
        expect(() => resolveDbms(dbmss, 'Unknown')).toThrow(/DBMS "Unknown" not found/i);
    });

    test('throws on ambiguous name', () => {
        expect(() => resolveDbms(dbmss, 'Ambiguous Name')).toThrow(/Multiple DBMSs found/i);
    });
});
