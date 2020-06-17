import {IFile, IProject} from '../../models';
import path from 'path';
import {TokenService} from '../../token.service';

export async function mapFileToModel(file: string, project: IProject): Promise<IFile | null> {
    try {
        const fileObj = {
            name: path.basename(file),
            extension: path.extname(file),
            directory: getNormalizedProjectPath(path.dirname(path.relative(project.root, file))),
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

export function getNormalizedProjectPath(projectPath: string): string {
    const dirname = path.normalize(projectPath);

    return path.normalize(dirname !== '.' ? `./${dirname}` : dirname);
}
