import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError} from '../errors';
import {discoverExtension, IExtensionMeta} from './extension-versions';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionMeta> => {
    await decompress(archivePath, outputDir);
    await fse.remove(archivePath);

    const packageDir = path.join(outputDir, 'package');

    try {
        return discoverExtension(packageDir);
    } catch (e) {
        await fse.remove(outputDir);
        await fse.remove(packageDir);

        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }
};
