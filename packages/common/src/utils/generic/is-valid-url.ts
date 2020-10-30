export const isValidUrl = (stringVal: string): boolean => {
    try {
        const url = new URL(stringVal);

        return ['http:', 'https:'].includes(url.protocol);
    } catch (_) {
        return false;
    }
};
