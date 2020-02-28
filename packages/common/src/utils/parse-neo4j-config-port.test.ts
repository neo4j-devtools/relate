import {parseNeo4jConfigPort} from './parse-neo4j-config-port';

describe('parseNeo4jConfigPort', () => {
    test('parses property correctly', () => {
        expect(parseNeo4jConfigPort('foo=:1234')).toBe(1234);
    });

    test('does not require properties syntax', () => {
        expect(parseNeo4jConfigPort(':1234')).toBe(1234);
    });

    test('does not require colon(:) syntax', () => {
        expect(parseNeo4jConfigPort('1234')).toBe(1234);
    });

    test('does throw on invalid value', () => {
        expect(parseNeo4jConfigPort('1T34')).toBe(NaN);
    });
});
