export const isValidUrl = (stringVal: string): boolean => {
    try {
        /* eslint-disable no-new */
        const url = new URL(stringVal);
        if (['http:', 'https:'].includes(url.protocol)) {
            return true;
        }
        return false;
    } catch (_) {
        return false;
    }
};
