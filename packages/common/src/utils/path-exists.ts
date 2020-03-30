import {pathExists} from 'fs-extra';

export const doesPathExist = async (path: string): Promise<boolean> => {
    try {
        await pathExists(path);
        return true;
    } catch (_) {
        return false;
    }
};
