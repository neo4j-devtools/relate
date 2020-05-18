export const isValidUrl = (stringVal: string): boolean => {
    try {
        const url = new URL(stringVal);
        if (['http:', 'https:'].includes(url.protocol)) {
            return true;
        }
        return false;
    } catch (_) {
        return false;
    }
};
