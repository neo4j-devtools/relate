import {isObjectLike} from 'lodash';
import {registerDecorator, isArray, isString, isBoolean, ValidationArguments, ValidationOptions} from 'class-validator';

export function IsValidUrl() {
    return (object: Record<string, any>, propertyName: string) => {
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
                        const url = new URL(value);
                        return Boolean(url.protocol);
                    } catch (e) {
                        return false;
                    }
                },
            },
        });
    };
}

export function IsValidJWT() {
    return (object: Record<string, any>, propertyName: string) => {
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

export function IsPluginConfig(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'isPluginConfig',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, _args: ValidationArguments) {
                    if (isObjectLike(value)) {
                        return Object.entries(value).every(([_, v]) => {
                            if (isArray(v)) {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                                // @ts-ignore
                                return Array.from(v).every(isString);
                            }

                            return isString(v) || isBoolean(v);
                        });
                    }

                    return false;
                },
                defaultMessage(args?: ValidationArguments) {
                    const expectedMsg = 'Expected "{ [key: string]: string | string[] | boolean }"';

                    if (!args) {
                        return expectedMsg;
                    }

                    const strValue = JSON.stringify(args.value);
                    return `${expectedMsg} on "${args.property}" but found "${strValue}" instead`;
                },
            },
        });
    };
}
