import fse from 'fs-extra';

import {FileStructureError} from '../../../errors';
import {discoverExtension, IExtensionMeta} from './extension-versions';
import {extract} from '../../../utils';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionMeta> => {
    const topLevelDir = await extract(archivePath, outputDir);

    try {
        return discoverExtension(topLevelDir);
    } catch (e) {
        await fse.remove(topLevelDir);

        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }
};
