import {assign} from 'lodash';
import {validateSync} from 'class-validator';

import {arrayHasItems} from '../utils';
import {ValidationFailureError} from '../errors';

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
