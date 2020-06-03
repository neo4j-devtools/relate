import {replace, trim} from 'lodash';

import {writePropertiesFile} from './write-properties-file';

jest.mock('fs-extra', () => {
    return {
        writeFile: (_path: string, data: string): Promise<string> => Promise.resolve(data),
    };
});

const WHITESPACE = / {2,}/g;

describe('writePropertiesFile', () => {
    test('Writes properties to file', async () => {
        const plain = new Map([
            ['bar.bam', 'baz'],
            ['bom.boz', 'true'],
        ]);
        const expected = trim(
            replace(
                `
                bar.bam=baz
                bom.boz=true
            `,
                WHITESPACE,
                '',
            ),
        );

        const properties = await writePropertiesFile('plain', plain);

        expect(properties).toEqual(expected);
    });

    test('Adds comments (without separator)', async () => {
        const comments = new Map([
            ['# hurr', ''],
            ['bar.bam', 'baz'],
            ['# durr', ''],
            ['bom.boz', 'true'],
        ]);
        const expected = trim(
            replace(
                `
                # hurr
                bar.bam=baz
                # durr
                bom.boz=true
            `,
                WHITESPACE,
                '',
            ),
        );

        const properties = await writePropertiesFile('comments', comments);

        expect(properties).toEqual(expected);
    });

    test('Omits empty keys', async () => {
        const emptyKey = new Map([
            ['bar.bam', 'baz'],
            ['', 'true'],
        ]);
        const expected = trim(
            replace(
                `
                bar.bam=baz
            `,
                WHITESPACE,
                '',
            ),
        );

        const properties = await writePropertiesFile('emptyKey', emptyKey);

        expect(properties).toEqual(expected);
    });
});
