import path from 'path';

export const isValidPath = (stringVal: string): boolean => {
    if (stringVal.split(path.sep).length > 1) {
        return true;
    }
    return false;
};
