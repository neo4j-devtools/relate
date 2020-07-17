import {List, Dict, Monad, Str} from '@relate/types';
import {FILTER_CONNECTORS, FILTER_COMPARATORS} from '../../constants';

export interface IRelateFilter {
    field: string;
    type?: FILTER_COMPARATORS;
    value: any | any[] | List<any>;
    connector?: FILTER_CONNECTORS;
}

export function applyEntityFilters<T extends object>(
    entities: List<T>,
    filters?: List<IRelateFilter> | IRelateFilter[],
): List<T> {
    const filtersToUse = List.from(filters);

    if (filtersToUse.isEmpty) {
        return entities;
    }

    const moreThanOne = filtersToUse.length.greaterThan(1);

    return entities.filter((entity: T) => {
        return filtersToUse.reduce((prev, filter) => {
            const {field, type, value, connector} = filter;

            return Dict.from(entity)
                .getValue(field)
                .flatMap((fieldValue: any) => {
                    const res = compare(fieldValue, value, type);

                    return moreThanOne && connector === FILTER_CONNECTORS.AND ? prev && res : prev || res;
                });
        }, moreThanOne);
    });
}

function compare(source: any, target: any, comparator = FILTER_COMPARATORS.EQUALS) {
    switch (comparator) {
        case FILTER_COMPARATORS.CONTAINS:
        case FILTER_COMPARATORS.NOT_CONTAINS: {
            return comparator === FILTER_COMPARATORS.CONTAINS
                ? Str.from(source).includes(target)
                : !Str.from(source).includes(target);
        }

        default:
        case FILTER_COMPARATORS.EQUALS:
        case FILTER_COMPARATORS.NOT_EQUALS: {
            return comparator === FILTER_COMPARATORS.EQUALS
                ? Monad.from(source).equals(target)
                : !Monad.from(source).equals(target);
        }
    }
}
