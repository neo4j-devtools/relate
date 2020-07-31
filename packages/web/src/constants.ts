import path from 'path';

// https://github.com/electron/electron/issues/2288
export const IS_ELECTRON =
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    typeof process !== 'undefined' && typeof process.versions === 'object' && Boolean(process.versions.electron);
export const PATH_TO_EXECUTABLE_ROOT = IS_ELECTRON ? '' : path.dirname(path.dirname(process.argv[1]));
