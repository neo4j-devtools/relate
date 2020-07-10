import path from 'path';

import {extract} from './extract';
import {FileStructureError} from '../errors';

jest.mock('decompress', () => ({
    __esModule: true,
    default: jest
        .fn()
        .mockResolvedValueOnce([
            {
                data: Buffer.of(),
                mode: 1,
                mtime: '1234',
                path: path.join('extractedRootDir', 'to', 'extracted', 'test-file'),
                type: 'file',
            },
            {
                data: Buffer.of(),
                mode: 1,
                mtime: '4321',
                path: path.join('another', 'extractedRootDir', 'to', 'extracted', 'test-file2'),
                type: 'file',
            },
        ])
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([
            {
                data: Buffer.of(),
                mode: 1,
                mtime: '1234',
                path: path.join('extractedRootDir', 'to', 'extracted', 'test-file'),
                type: 'file',
            },
        ]),
}));

jest.mock('fs-extra');

describe('extract', () => {
    test('more than 1 output root dir path', async () => {
        await expect(extract('/path/to/archive', 'path/to/outputDir')).rejects.toThrow(
            new FileStructureError('Unexpected file structure after unpacking'),
        );
    });

    test('no output output root dir path', async () => {
        await expect(extract('/path/to/archive', 'path/to/outputDir')).rejects.toThrow(
            new FileStructureError('Unexpected file structure after unpacking'),
        );
    });

    test('exactly 1 output root dir path', async () => {
        await expect(extract('/path/to/archive', 'path/to/outputDir')).resolves.toBe(
            path.join('extractedRootDir', 'to', 'extracted', 'test-file'),
        );
    });
});
