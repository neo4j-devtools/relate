import {assign} from 'lodash';
import {
    isArray,
    isString,
    registerDecorator,
    validateSync,
    ValidationArguments,
    ValidationOptions,
} from 'class-validator';

// leave specific imports to prevent circular references
import {arrayHasItems} from '../utils/generic/array-has-items';
import {ValidationFailureError} from '../errors/validation-failure.error';

export function StringOrStringArray(validationOptions?: ValidationOptions) {
    return (object: any, propertyName: string) => {
        registerDecorator({
            name: 'stringOrStringArray',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: unknown, _args: ValidationArguments) {
                    if (isArray(value)) {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                        // @ts-ignore
                        return Array.from(value).every((v) => isString(v));
                    }

                    return isString(value);
                },
                defaultMessage(args?: ValidationArguments) {
                    if (!args) {
                        return 'Property must be a string or an array of strings';
                    }

                    return `Expected string or string array on property "${args.property}" found "${args.value}"`;
                },
            },
        });
    };
}

export abstract class ModelAbstract<T = any> {
    constructor(props: T) {
        assign(this, props);
        this.validate();
    }

    private validate(): void {
        const errors = validateSync(this);

        if (arrayHasItems(errors)) {
            throw new ValidationFailureError(`${this.constructor.name} validation failure`, errors);
        }
    }
}
