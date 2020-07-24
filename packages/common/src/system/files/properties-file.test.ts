import * as read from '../../utils/files/read-properties-file';
import * as write from '../../utils/files/write-properties-file';
import {PropertiesFile} from './properties-file';

jest.mock('./properties-file.constants.ts', () => ({
    NEO4J_CONFIG_DEFAULTS: {
        defaultFoo: 'defaultBar',
    },
}));

describe('PropertiesFile', () => {
    const path = '/path/to/config/file';
    let configProperties: read.PropertyEntries;
    let readPropertiesFileSpy: jest.SpyInstance;
    let writePropertiesFileSpy: jest.SpyInstance;

    beforeEach(() => {
        readPropertiesFileSpy = jest.spyOn(read, 'readPropertiesFile');
        writePropertiesFileSpy = jest.spyOn(write, 'writePropertiesFile');
    });

    test('readFile', async () => {
        configProperties = [['foo1', 'bar1']];
        const spy = readPropertiesFileSpy.mockResolvedValue(configProperties);
        const config = await PropertiesFile.readFile(path);

        expect(spy).toHaveBeenCalledWith(path);

        expect(config.path).toBe(path);
        expect(config.config).toEqual(configProperties);
        expect(config).toBeInstanceOf(PropertiesFile);
    });

    test('set', async () => {
        configProperties = [
            ['foo1', 'bar1'],
            ['#foo2', 'bar2'],
        ];
        readPropertiesFileSpy.mockResolvedValue(configProperties);
        const spy = writePropertiesFileSpy.mockResolvedValue(Promise.resolve());
        const config = await PropertiesFile.readFile(path);

        config.set('foo1', 'foobar1');
        await config.flush();

        expect(spy).toHaveBeenCalledWith(path, [
            ['foo1', 'foobar1'],
            ['#foo2', 'bar2'],
        ]);

        config.set('foo2', 'foobar2');
        await config.flush();

        expect(spy).toHaveBeenCalledWith(path, [
            ['foo1', 'foobar1'],
            ['foo2', 'foobar2'],
        ]);
    });

    test('get', async () => {
        configProperties = [['a.key.that.exists', 'value1']];
        readPropertiesFileSpy.mockResolvedValue(configProperties);
        const config = await PropertiesFile.readFile(path);

        expect(config.get('a.key.that.exists')).toBe('value1');
        expect(config.get('defaultFoo')).toBe('defaultBar');
        expect(config.get('not.a.key.that.exists')).toBeUndefined();
    });

    afterEach(() => jest.clearAllMocks());
});
