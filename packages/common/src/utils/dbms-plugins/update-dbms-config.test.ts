import {PropertiesFile} from '../../system';
import {updateDbmsConfig} from './update-dbms-config';

describe('updateDbmsConfig', () => {
    test('"string" overwrites existing values', () => {
        const config = new PropertiesFile([['existingProp', 'existingValue']], '');

        updateDbmsConfig(config, {
            newProp: 'value',
            existingProp: 'newValue',
        });

        expect(config.get('newProp')).toEqual('value');
        expect(config.get('existingProp')).toEqual('newValue');
    });

    test('"string[]" adds any non-existing values', () => {
        const config = new PropertiesFile([['existingProp', 'existingValue']], '');

        updateDbmsConfig(config, {
            newProp: ['value'],
            existingProp: ['existingValue', 'newValue'],
        });

        expect(config.get('newProp')).toEqual('value');
        expect(config.get('existingProp')).toEqual('existingValue,newValue');
    });

    test('"+:string" overwrite existing values', () => {
        const config = new PropertiesFile([['existingProp', 'existingValue']], '');

        updateDbmsConfig(config, {
            '+:newProp': 'value',
            '+:existingProp': 'newValue',
        });

        expect(config.get('newProp')).toEqual('value');
        expect(config.get('existingProp')).toEqual('newValue');
    });

    test('"+:string[]" adds any non-existing values', () => {
        const config = new PropertiesFile([['existingProp', 'existingValue']], '');

        updateDbmsConfig(config, {
            '+:newProp': ['value'],
            '+:existingProp': ['existingValue', 'newValue'],
        });

        expect(config.get('newProp')).toEqual('value');
        expect(config.get('existingProp')).toEqual('existingValue,newValue');
    });

    test('"-:bool" removes key if it exists', () => {
        const config = new PropertiesFile([['existingProp', 'existingValue']], '');

        updateDbmsConfig(config, {
            '-:newProp': true,
            '-:existingProp': true,
        });

        expect(config.get('newProp')).toEqual(undefined);
        expect(config.get('existingProp')).toEqual('');
    });

    test('"-:string" removes value if it matches string', () => {
        const config = new PropertiesFile(
            [
                ['existingProp', 'existingValue'],
                ['otherProp', 'existingValue'],
            ],
            '',
        );

        updateDbmsConfig(config, {
            '-:existingProp': 'existingValue',
            '-:otherProp': 'newValue',
        });

        expect(config.get('existingProp')).toEqual('');
        expect(config.get('otherProp')).toEqual('existingValue');
    });

    test('"-:string[]" removes matching values', () => {
        const config = new PropertiesFile(
            [
                ['prop1', 'existingValue'],
                ['prop2', 'existingValue'],
                ['prop3', 'foo,bar,baz'],
            ],
            '',
        );

        updateDbmsConfig(config, {
            '-:prop1': ['notExistingValue'],
            '-:prop2': ['existingValue'],
            '-:prop3': ['bar'],
        });

        expect(config.get('prop1')).toEqual('existingValue');
        expect(config.get('prop2')).toEqual('');
        expect(config.get('prop3')).toEqual('foo,baz');
    });
});
