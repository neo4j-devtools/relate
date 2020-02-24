import {assign} from 'lodash';
import {validateSync} from 'class-validator';

import {IAccountConfig} from '../types';

import {arrayHasItems} from '../utils';
import {ValidationFailureError} from '../errors';

export abstract class ConfigModelAbstract {
    constructor(props: IAccountConfig) {
        assign(this, props);
        this.validate();
    }

    private validate(): void {
        const errors = validateSync(this);

        if (arrayHasItems(errors)) {
            if (arrayHasItems(errors)) {
                throw new ValidationFailureError(`${this.constructor.name} validation failure`, errors);
            }
        }
    }
}
