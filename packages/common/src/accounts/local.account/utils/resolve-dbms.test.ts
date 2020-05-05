import {resolveDbms} from './resolve-dbms';

describe('resolveDbms', () => {
    const dbmss = {
        c9992c2f: {
            connectionUri: 'nowhere',
            description: '',
            id: 'c9992c2f',
            name: 'Unique Name',
        },
        e45a7499: {
            connectionUri: 'nowhere',
            description: '',
            id: 'e45a7499',
            name: 'Ambiguous Name',
        },
        f2bdb05c: {
            connectionUri: 'nowhere',
            description: '',
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
