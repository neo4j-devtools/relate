import _ from 'lodash';
import fse from 'fs-extra';
import decompress from 'decompress';
import path from 'path';

import {FileStructureError} from '../errors';
import {discoverExtension, IExtensionMeta} from './extension-versions';
import {arrayHasItems} from './array-has-items';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionMeta> => {
    const outputFiles = await decompress(archivePath, outputDir);

    let uniqueTopLevelNames: string[];
    // determine output dir filename from the shortest directory string path if possible
    // @todo: didn't detect any 'directories' when extracting an example extension - needs rethink
    const outputTopLevelDir = _.reduce(
        _.filter(outputFiles, (file) => file.type === 'directory'),
        (a, b) => (a.path.length <= b.path.length ? a : b),
    );

    if (!outputTopLevelDir) {
        // @todo: determine output from spitting the filename to the get the top level dir (should be consistent).
        uniqueTopLevelNames = [...new Set(_.map(outputFiles, (file) => file.path.split(path.sep)[0]))];

        if (!arrayHasItems(uniqueTopLevelNames) || uniqueTopLevelNames.length > 1) {
            // @todo: this may not remove all the files
            // outputFiles .path property may not contain a reference to directories so only deleting files within.
            await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
            throw new FileStructureError(`Unexpected file structure after unpacking`);
        }
    }
    const outputTopLevel = outputTopLevelDir ? outputTopLevelDir.path : uniqueTopLevelNames![0];
    const extractedDistPath = path.join(outputDir, outputTopLevel);

    // check if this is an extension...
    try {
        const info = await discoverExtension(extractedDistPath);

        return info;
    } catch (e) {
        await Promise.all(_.map(outputFiles, (file) => fse.remove(path.join(outputDir, file.path))));
        throw e;
    }
};
