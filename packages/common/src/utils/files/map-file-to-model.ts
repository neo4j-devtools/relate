import {IRelateFile, IProject} from '../../models';
import path from 'path';
import {TokenService} from '../../token.service';
import {InvalidArgumentError} from '../../errors';

export async function mapFileToModel(file: string, project: IProject): Promise<IRelateFile | null> {
    try {
        const fileObj = {
            name: path.basename(file),
            extension: path.extname(file),
            directory: getRelativeProjectPath(project, path.dirname(file)),
        };

        return {
            ...fileObj,
            downloadToken: await TokenService.sign({
                ...fileObj,
                projectName: project.name,
            }),
        };
    } catch (_e) {
        return null;
    }
}

export function getAbsoluteProjectPath(project: IProject, filePath: string): string {
    const absolutePath = path.normalize(path.resolve(project.root, filePath));

    if (filePath.includes('..') || !absolutePath.startsWith(project.root)) {
        throw new InvalidArgumentError('Path must point to a location within the project directory');
    }

    return absolutePath;
}

export function getRelativeProjectPath(project: IProject, filePath: string): string {
    const absolutePath = getAbsoluteProjectPath(project, filePath);

    return path.relative(project.root, absolutePath) || '.';
}
