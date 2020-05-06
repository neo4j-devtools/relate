import {join, map, values} from 'lodash';
import {ValidationError} from 'class-validator';

export class ValidationFailureError extends Error {
    constructor(message: string, errors: ValidationError[] = []) {
        super(
            `${message}:\n\n${join(
                map(
                    errors,
                    ({property, constraints}) =>
                        `- Property "${property}" failed the following constraints: ${join(values(constraints), ', ')}`,
                ),
                '\n',
            )}`,
        );
    }
}
