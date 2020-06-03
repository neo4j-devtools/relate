export function isIterable(val: any): val is Iterable<any> {
    return val && typeof val[Symbol.iterator] === 'function';
}
