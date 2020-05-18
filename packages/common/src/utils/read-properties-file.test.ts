import {readPropertiesFile} from './read-properties-file';

jest.mock('fs-extra', () => {
    const MOCKS = {
        comments: `
            # hurr
            bar.bam=baz
            # durr
            bom.boz=true
        `,
        plain: `
            bar.bam=baz
            bom.boz=true
        `,
        whitespace: `
        
            bar.bam=baz
           
            
            
            bom.boz=true
        `,
    };

    return {
        readFile: (path: 'plain' | 'comments' | 'whitespace'): Promise<string> => Promise.resolve(MOCKS[path]),
    };
});

describe('readPropertiesFile', () => {
    test('Parses properties file', async () => {
        const expected = new Map([
            ['bar.bam', 'baz'],
            ['bom.boz', 'true'],
        ]);

        const properties = await readPropertiesFile('plain');

        expect(properties).toEqual(expected);
    });
    test('Preserves comments', async () => {
        const expected = new Map([
            ['# hurr', ''],
            ['bar.bam', 'baz'],
            ['# durr', ''],
            ['bom.boz', 'true'],
        ]);

        const properties = await readPropertiesFile('comments');

        expect(properties).toEqual(expected);
    });
    test('Omits whitespace', async () => {
        const expected = new Map([
            ['bar.bam', 'baz'],
            ['bom.boz', 'true'],
        ]);

        const properties = await readPropertiesFile('whitespace');

        expect(properties).toEqual(expected);
    });
});
