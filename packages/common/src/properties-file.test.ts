import * as mockUtils from './utils';

import {PropertiesFile} from './properties-file';

describe('PropertiesFile', () => {
    const path = '/path/to/config/file';
    let configProperties: Map<string, string>;
    let readPropertiesFileSpy: jest.SpyInstance;
    let writePropertiesFileSpy: jest.SpyInstance;

    beforeEach(() => {
        readPropertiesFileSpy = jest.spyOn(mockUtils, 'readPropertiesFile');
        writePropertiesFileSpy = jest.spyOn(mockUtils, 'writePropertiesFile');
    });

    test('readFile', async () => {
        configProperties = new Map([['foo1', 'bar1']]);
        const spy = readPropertiesFileSpy.mockResolvedValue(configProperties);
        const config = await PropertiesFile.readFile(path);
        expect(spy).toHaveBeenCalledWith(path);
        expect(config.path).toBe(path);
        expect(config.config).toEqual(configProperties);
        expect(config).toBeInstanceOf(PropertiesFile);
    });

    test('set', async () => {
        configProperties = new Map([
            ['foo1', 'bar1'],
            ['#foo2', 'bar2'],
        ]);
        readPropertiesFileSpy.mockResolvedValue(configProperties);
        const spy = writePropertiesFileSpy.mockResolvedValue(Promise.resolve());
        const config = await PropertiesFile.readFile(path);

        await config.set('foo1', 'foobar1');
        expect(spy).toHaveBeenCalledWith(
            path,
            new Map([
                ['foo1', 'foobar1'],
                ['#foo2', 'bar2'],
            ]),
        );
        expect(config.config).toEqual(
            new Map([
                ['foo1', 'foobar1'],
                ['#foo2', 'bar2'],
            ]),
        );

        await config.set('foo2', 'foobar2');
        expect(spy).toHaveBeenCalledWith(
            path,
            new Map([
                ['foo1', 'foobar1'],
                ['foo2', 'foobar2'],
            ]),
        );
        expect(config.config).toEqual(
            new Map([
                ['foo1', 'foobar1'],
                ['foo2', 'foobar2'],
            ]),
        );
    });

    test('get', async () => {
        configProperties = new Map([['a.key.that.exists', 'value1']]);
        readPropertiesFileSpy.mockResolvedValue(configProperties);
        const config = await PropertiesFile.readFile(path);

        expect(config.get('a.key.that.exists')).toBe('value1');
        expect(config.get('not.a.key.that.exists')).toBeUndefined();
        // this is to test getting a default value for now...
        expect(config.get('dbms.security.auth_enabled')).toBe('true');
    });

    afterEach(() => jest.clearAllMocks());
});
