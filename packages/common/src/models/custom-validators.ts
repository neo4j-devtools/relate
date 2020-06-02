import {registerDecorator} from 'class-validator';

export function IsValidUrl() {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidUrl',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: 'Must be valid URL',
            },
            validator: {
                validate(value: any) {
                    try {
                        new URL(value);
                        return true;
                    } catch (e) {
                        return false;
                    }
                },
            },
        });
    };
}

export function IsValidJWT() {
    return function(object: Object, propertyName: string) {
        registerDecorator({
            name: 'isValidJWT',
            target: object.constructor,
            propertyName: propertyName,
            options: {
                message: 'Must be valid JWT token',
            },
            validator: {
                validate(value: any) {
                    const JWT_REGEX = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/m;

                    if (!value || typeof value !== 'string') {
                        return false;
                    }

                    const match = value.match(JWT_REGEX);

                    return Boolean(match && match[0].length === value.length);
                },
            },
        });
    };
}
