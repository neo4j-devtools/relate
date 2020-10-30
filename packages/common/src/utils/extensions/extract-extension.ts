import fse from 'fs-extra';

import {FileStructureError} from '../../errors';
import {discoverExtension} from './extension-versions';

import {HOOK_EVENTS} from '../../constants';
import {emitHookEvent} from '../event-hooks';
import {extract} from '../extract';
import {IExtensionInfo} from '../../models';

export const extractExtension = async (archivePath: string, outputDir: string): Promise<IExtensionInfo> => {
    await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_START, 'extracting');
    const topLevelDir = await extract(archivePath, outputDir);
    await emitHookEvent(HOOK_EVENTS.RELATE_EXTENSION_EXTRACT_STOP, null);

    try {
        return discoverExtension(topLevelDir);
    } catch (e) {
        await fse.remove(topLevelDir);

        throw new FileStructureError(`Unexpected file structure after unpacking`);
    }
};
