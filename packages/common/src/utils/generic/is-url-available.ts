import got from 'got';

export const isUrlAvailable = async (url: string): Promise<boolean> => {
    try {
        await got(url);
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return false;
        }
    }
    return true;
};
