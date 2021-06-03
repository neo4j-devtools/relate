// import got from 'got';
import {request} from '../download';

export const isUrlAvailable = async (url: string): Promise<boolean> => {
    try {
        await request(url);
    } catch (error) {
        console.log({code: error.code, url, message: error.message});
        if (error.code === 'ECONNREFUSED') {
            return false;
        }
    }
    return true;
};
