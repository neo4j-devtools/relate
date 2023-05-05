[@relate/types](../README.md) / [primitive/num.monad](../modules/primitive_num_monad.md) / default

# Class: default

[primitive/num.monad](../modules/primitive_num_monad.md).default

**`Description`**

Represents a Number value

If you just want to access the plain JS value, use `.get()`:
```ts
const num: Num = Num.from('100');
const plain: 100 = num.get();
```

## Hierarchy

- [`default`](monad.default.md)<`number`\>

  ↳ **`default`**

## Table of contents

### Properties

- [MAX\_VALUE](primitive_num_monad.default.md#max_value)
- [MIN\_VALUE](primitive_num_monad.default.md#min_value)
- [NEG\_ONE](primitive_num_monad.default.md#neg_one)
- [ONE](primitive_num_monad.default.md#one)
- [ZERO](primitive_num_monad.default.md#zero)

### Accessors

- [isEmpty](primitive_num_monad.default.md#isempty)
- [isEven](primitive_num_monad.default.md#iseven)
- [isInteger](primitive_num_monad.default.md#isinteger)
- [isNegative](primitive_num_monad.default.md#isnegative)
- [isOdd](primitive_num_monad.default.md#isodd)
- [isPositive](primitive_num_monad.default.md#ispositive)
- [isZero](primitive_num_monad.default.md#iszero)

### Methods

- [add](primitive_num_monad.default.md#add)
- [divide](primitive_num_monad.default.md#divide)
- [equals](primitive_num_monad.default.md#equals)
- [flatMap](primitive_num_monad.default.md#flatmap)
- [get](primitive_num_monad.default.md#get)
- [getOrElse](primitive_num_monad.default.md#getorelse)
- [greaterThan](primitive_num_monad.default.md#greaterthan)
- [greaterThanOrEqual](primitive_num_monad.default.md#greaterthanorequal)
- [isThis](primitive_num_monad.default.md#isthis)
- [lessThan](primitive_num_monad.default.md#lessthan)
- [lessThanOrEqual](primitive_num_monad.default.md#lessthanorequal)
- [map](primitive_num_monad.default.md#map)
- [modulo](primitive_num_monad.default.md#modulo)
- [multiply](primitive_num_monad.default.md#multiply)
- [negate](primitive_num_monad.default.md#negate)
- [subtract](primitive_num_monad.default.md#subtract)
- [switchMap](primitive_num_monad.default.md#switchmap)
- [tap](primitive_num_monad.default.md#tap)
- [toInt](primitive_num_monad.default.md#toint)
- [toJSON](primitive_num_monad.default.md#tojson)
- [toString](primitive_num_monad.default.md#tostring)
- [valueOf](primitive_num_monad.default.md#valueof)
- [from](primitive_num_monad.default.md#from)
- [isMonad](primitive_num_monad.default.md#ismonad)
- [isNum](primitive_num_monad.default.md#isnum)
- [of](primitive_num_monad.default.md#of)

## Properties

### MAX\_VALUE

▪ `Static` `Readonly` **MAX\_VALUE**: [`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:20

___

### MIN\_VALUE

▪ `Static` `Readonly` **MIN\_VALUE**: [`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:22

___

### NEG\_ONE

▪ `Static` `Readonly` **NEG\_ONE**: [`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:18

___

### ONE

▪ `Static` `Readonly` **ONE**: [`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:16

___

### ZERO

▪ `Static` `Readonly` **ZERO**: [`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:14

## Accessors

### isEmpty

• `get` **isEmpty**(): `boolean`

Num is empty if value is not a number

#### Returns

`boolean`

#### Overrides

Monad.isEmpty

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:39

___

### isEven

• `get` **isEven**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:51

___

### isInteger

• `get` **isInteger**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:63

___

### isNegative

• `get` **isNegative**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:55

___

### isOdd

• `get` **isOdd**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:47

___

### isPositive

• `get` **isPositive**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:59

___

### isZero

• `get` **isZero**(): `boolean`

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:43

## Methods

### add

▸ **add**(`other`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:155

___

### divide

▸ **divide**(`divisor`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `divisor` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:173

___

### equals

▸ **equals**(`other`): `boolean`

Checks if other has the same raw value

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `any` |

#### Returns

`boolean`

#### Overrides

[default](monad.default.md).[equals](monad.default.md#equals)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:129

___

### flatMap

▸ **flatMap**<`M`\>(`project`): `M`

Unpack monad value and return anything.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: 'foo bar' = foo.flatMap((val) => `${val} bar`);
```

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `number`) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[flatMap](monad.default.md#flatmap)

#### Defined in

packages/types/src/monads/monad.ts:180

___

### get

▸ **get**(): `number`

Get raw value of monad

#### Returns

`number`

#### Inherited from

[default](monad.default.md).[get](monad.default.md#get)

#### Defined in

packages/types/src/monads/monad.ts:114

___

### getOrElse

▸ **getOrElse**(`other`): `number`

Get raw value of monad if not empty, else use other
```ts
const otherWhenNotEmpty: 'foo' = Monad.of('foo').getOrElse('bar');
const otherWhenEmpty: 'bar' = Monad.of('').getOrElse('bar');
const throwWhenEmpty: never = Monad.of('').getOrElse(() => {
    throw new Error('empty');
});
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `number` \| () => `number` |

#### Returns

`number`

#### Inherited from

[default](monad.default.md).[getOrElse](monad.default.md#getorelse)

#### Defined in

packages/types/src/monads/monad.ts:128

___

### greaterThan

▸ **greaterThan**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:143

___

### greaterThanOrEqual

▸ **greaterThanOrEqual**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:147

___

### isThis

▸ **isThis**(`val?`): val is default

Indicates if passed value is an instance of `this`
```ts
if (ours.isThis(other)) {
    // is instance of same constructor
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `any` |

#### Returns

val is default

#### Inherited from

[default](monad.default.md).[isThis](monad.default.md#isthis)

#### Defined in

packages/types/src/monads/monad.ts:57

___

### lessThan

▸ **lessThan**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:135

___

### lessThanOrEqual

▸ **lessThanOrEqual**(`other`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

`boolean`

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:139

___

### map

▸ **map**(`project`): [`default`](primitive_num_monad.default.md)

Modify monad value without changing the type.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Monad<'foo bar'> = foo.map((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `number`) => `number` |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Inherited from

[default](monad.default.md).[map](monad.default.md#map)

#### Defined in

packages/types/src/monads/monad.ts:165

___

### modulo

▸ **modulo**(`divisor`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `divisor` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:179

___

### multiply

▸ **multiply**(`multiplier`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `multiplier` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:167

___

### negate

▸ **negate**(): [`default`](primitive_num_monad.default.md)

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:151

___

### subtract

▸ **subtract**(`other`): [`default`](primitive_num_monad.default.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `other` | `string` \| `number` \| [`default`](primitive_num_monad.default.md) |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:161

___

### switchMap

▸ **switchMap**<`M`\>(`project`): `M`

Switch monad for Iterable (of any type).
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const fooBar: Num<3> = foo.switchMap((val: Str) => Num.from(val.length));
```

#### Type parameters

| Name |
| :------ |
| `M` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: [`default`](primitive_num_monad.default.md)) => `M` |

#### Returns

`M`

#### Inherited from

[default](monad.default.md).[switchMap](monad.default.md#switchmap)

#### Defined in

packages/types/src/monads/monad.ts:191

___

### tap

▸ **tap**(`project`): [`default`](primitive_num_monad.default.md)

Access value without modifying it. Useful when all you need is to log etc.
```ts
const foo: Monad<'foo'> = Monad.from('foo');
const stillFoo: Monad<'foo'> = foo.tap((val) => `${val} bar`);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `project` | (`value`: `number`) => `void` |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Inherited from

[default](monad.default.md).[tap](monad.default.md#tap)

#### Defined in

packages/types/src/monads/monad.ts:152

___

### toInt

▸ **toInt**(): [`default`](primitive_num_monad.default.md)

Math.trunc()

#### Returns

[`default`](primitive_num_monad.default.md)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:125

___

### toJSON

▸ **toJSON**(): `any`

When calling `.toJSON()`

#### Returns

`any`

#### Inherited from

[default](monad.default.md).[toJSON](monad.default.md#tojson)

#### Defined in

packages/types/src/monads/monad.ts:205

___

### toString

▸ **toString**(`radix?`): `string`

When calling `.toString()`

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `radix` | `number` | `10` |

#### Returns

`string`

#### Overrides

[default](monad.default.md).[toString](monad.default.md#tostring)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:118

___

### valueOf

▸ **valueOf**(): `number`

When calling `.valueOf()`

#### Returns

`number`

#### Inherited from

[default](monad.default.md).[valueOf](monad.default.md#valueof)

#### Defined in

packages/types/src/monads/monad.ts:212

___

### from

▸ `Static` **from**(`val?`): [`default`](primitive_num_monad.default.md)

Coerces anything into a Num

**`See`**

[of](primitive_num_monad.default.md#of)

#### Parameters

| Name | Type |
| :------ | :------ |
| `val?` | `any` |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Overrides

[default](monad.default.md).[from](monad.default.md#from)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:102

___

### isMonad

▸ `Static` **isMonad**<`T`\>(`val`): val is default<T\>

Indicates if passed value is an instance of `Monad`
```ts
if (Monad.isMonad(val)) {
    // is a monad
}
```

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default<T\>

#### Inherited from

[default](monad.default.md).[isMonad](monad.default.md#ismonad)

#### Defined in

packages/types/src/monads/monad.ts:76

___

### isNum

▸ `Static` **isNum**(`val`): val is default

Indicates if passed value is an instance of `Num`
```ts
if (Num.isNum(val)) {
    // is a Num
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

val is default

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:75

___

### of

▸ `Static` **of**(`val`): [`default`](primitive_num_monad.default.md)

Returns Num representation of the passed value.

```ts
const strBool: Num<0> = Num.of(0);
const strBool: Num<1> = Num.of(true);

const strMonad: Num<10> = Num.from('10');
const strMonad: Num<NaN> = Num.from('foo');

const arrBool: Num<2> = Num.of([2]);

const arrBool: Num<NaN> = Num.of([1,2,3]);
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `any` |

#### Returns

[`default`](primitive_num_monad.default.md)

#### Overrides

[default](monad.default.md).[of](monad.default.md#of)

#### Defined in

packages/types/src/monads/primitive/num.monad.ts:94
