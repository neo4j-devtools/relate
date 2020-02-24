import {assign} from 'lodash';
import {validateSync} from 'class-validator';

import {ACCOUNT_TYPES} from '../accounts';
import {arrayHasItems} from '../utils';
import {ValidationFailureError} from '../errors';

export interface IAccountConfig {
    id: string;
    user: any;
    neo4jDataPath: string;
    type: ACCOUNT_TYPES;
}

export abstract class ConfigModelAbstract {
    constructor(props: IAccountConfig) {
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
