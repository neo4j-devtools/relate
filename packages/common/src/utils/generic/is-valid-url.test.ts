import {isValidUrl} from './is-valid-url';

describe('isValidUrl', () => {
    test('with valid URL', () => {
        expect(isValidUrl('http://validurl.com')).toBe(true);
        expect(isValidUrl('http://validurl-with-some-port.com:8080')).toBe(true);
        expect(isValidUrl('https://url/with/path')).toBe(true);
        expect(isValidUrl('https://url/with/?params=true')).toBe(true);
    });

    test('with invalid URL', () => {
        expect(isValidUrl('')).toBe(false);
        expect(isValidUrl('..')).toBe(false);
        expect(isValidUrl('path/to/foo')).toBe(false);
        expect(isValidUrl('C:\\not\\really\\a\\url')).toBe(false);
        expect(isValidUrl('C:also\\not\\a\\url')).toBe(false);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        expect(isValidUrl(undefined)).toBe(false);
    });
});
