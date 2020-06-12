import {IFile} from '../../models';
import path from 'path';

export function mapFileToModel(file: string, baseDir: string): IFile | null {
    try {
        return {
            name: path.basename(file),
            extension: path.extname(file),
            directory: getNormalizedProjectPath(path.dirname(path.relative(baseDir, file))),
        };
    } catch (_e) {
        return null;
    }
}

export function getNormalizedProjectPath(projectPath: string): string {
    const dirname = path.normalize(projectPath);

    return path.normalize(dirname !== '.' ? `./${dirname}` : dirname);
}
