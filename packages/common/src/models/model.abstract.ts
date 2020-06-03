import {assign} from 'lodash';
import {validateSync} from 'class-validator';

// leave specific imports to prevent circular references
import {arrayHasItems} from '../utils/generic/array-has-items';
import {ValidationFailureError} from '../errors/validation-failure.error';

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
