import {IFile} from '../../models';
import path from 'path';

export function mapFileToModel(file: string, baseDir: string): IFile | null {
    try {
        return {
            name: path.basename(file),
            extension: path.extname(file),
            directory: path.relative(baseDir, path.dirname(file)) || '.',
        };
    } catch (_e) {
        return null;
    }
}
