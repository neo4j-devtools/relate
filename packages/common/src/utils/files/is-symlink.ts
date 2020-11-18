import fse from 'fs-extra';

export async function isSymlink(filePath: string): Promise<boolean> {
    try {
        const stat = await fse.lstat(filePath);
        return stat.isSymbolicLink();
    } catch {
        return false;
    }
}
