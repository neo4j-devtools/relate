[@relate/types](../README.md) › [Num](num.md)

# Class: Num

**`description`** 
Represents a Number value

If you just want to access the plain JS value, use `.get()`:
```ts
const num: Num = Num.from('100');
const plain: 100 = num.get();
```

## Hierarchy

* [Monad](monad.md)‹number›

  ↳ **Num**

## Implements

* [IMonad](../interfaces/imonad.md)‹number›

## Index

### Properties

* [MAX_VALUE](num.md#static-readonly-max_value)
* [MIN_VALUE](num.md#static-readonly-min_value)
* [NEG_ONE](num.md#static-readonly-neg_one)
* [ONE](num.md#static-readonly-one)
* [ZERO](num.md#static-readonly-zero)

### Accessors

* [isEmpty](num.md#isempty)
* [isEven](num.md#iseven)
* [isInteger](num.md#isinteger)
* [isNegative](num.md#isnegative)
* [isOdd](num.md#isodd)
* [isPositive](num.md#ispositive)
* [isZero](num.md#iszero)

### Methods

* [add](num.md#add)
* [divide](num.md#divide)
* [equals](num.md#equals)
* [greaterThan](num.md#greaterthan)
* [greaterThanOrEqual](num.md#greaterthanorequal)
* [lessThan](num.md#lessthan)
* [lessThanOrEqual](num.md#lessthanorequal)
* [modulo](num.md#modulo)
* [multiply](num.md#multiply)
* [negate](num.md#negate)
* [subtract](num.md#subtract)
* [toInt](num.md#toint)
* [toString](num.md#tostring)
* [from](num.md#static-from)
* [isNum](num.md#static-isnum)
* [of](num.md#static-of)

## Properties

### `Static` `Readonly` MAX_VALUE

▪ **MAX_VALUE**: *[Num](num.md)‹›* = new Num(Number.MAX_SAFE_INTEGER)

Defined in src/monads/primitive/num.monad.ts:21

___

### `Static` `Readonly` MIN_VALUE

▪ **MIN_VALUE**: *[Num](num.md)‹›* = new Num(Number.MIN_SAFE_INTEGER)

Defined in src/monads/primitive/num.monad.ts:23

___

### `Static` `Readonly` NEG_ONE

▪ **NEG_ONE**: *[Num](num.md)‹›* = new Num(-1)

Defined in src/monads/primitive/num.monad.ts:19

___

### `Static` `Readonly` ONE

▪ **ONE**: *[Num](num.md)‹›* = new Num(1)

Defined in src/monads/primitive/num.monad.ts:17

___

### `Static` `Readonly` ZERO

▪ **ZERO**: *[Num](num.md)‹›* = new Num(0)

Defined in src/monads/primitive/num.monad.ts:15

## Accessors

###  isEmpty

• **get isEmpty**(): *boolean*

*Overrides [Monad](monad.md).[isEmpty](monad.md#isempty)*

Defined in src/monads/primitive/num.monad.ts:40

Num is empty if value is not a number

**Returns:** *boolean*

___

###  isEven

• **get isEven**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:52

**Returns:** *boolean*

___

###  isInteger

• **get isInteger**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:64

**Returns:** *boolean*

___

###  isNegative

• **get isNegative**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:56

**Returns:** *boolean*

___

###  isOdd

• **get isOdd**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:48

**Returns:** *boolean*

___

###  isPositive

• **get isPositive**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:60

**Returns:** *boolean*

___

###  isZero

• **get isZero**(): *boolean*

Defined in src/monads/primitive/num.monad.ts:44

**Returns:** *boolean*

## Methods

###  add

▸ **add**(`other`: number | string | [Num](num.md)): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:156

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Num](num.md)*

___

###  divide

▸ **divide**(`divisor`: number | string | [Num](num.md)): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:174

**Parameters:**

Name | Type |
------ | ------ |
`divisor` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Num](num.md)*

___

###  equals

▸ **equals**(`other`: any): *boolean*

*Overrides [Monad](monad.md).[equals](monad.md#equals)*

Defined in src/monads/primitive/num.monad.ts:130

**Parameters:**

Name | Type |
------ | ------ |
`other` | any |

**Returns:** *boolean*

___

###  greaterThan

▸ **greaterThan**(`other`: number | string | [Num](num.md)): *boolean*

Defined in src/monads/primitive/num.monad.ts:144

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *boolean*

___

###  greaterThanOrEqual

▸ **greaterThanOrEqual**(`other`: number | string | [Num](num.md)): *boolean*

Defined in src/monads/primitive/num.monad.ts:148

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *boolean*

___

###  lessThan

▸ **lessThan**(`other`: number | string | [Num](num.md)): *boolean*

Defined in src/monads/primitive/num.monad.ts:136

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *boolean*

___

###  lessThanOrEqual

▸ **lessThanOrEqual**(`other`: number | string | [Num](num.md)): *boolean*

Defined in src/monads/primitive/num.monad.ts:140

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *boolean*

___

###  modulo

▸ **modulo**(`divisor`: number | string | [Num](num.md)): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:180

**Parameters:**

Name | Type |
------ | ------ |
`divisor` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Num](num.md)*

___

###  multiply

▸ **multiply**(`multiplier`: number | string | [Num](num.md)): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:168

**Parameters:**

Name | Type |
------ | ------ |
`multiplier` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Num](num.md)*

___

###  negate

▸ **negate**(): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:152

**Returns:** *[Num](num.md)*

___

###  subtract

▸ **subtract**(`other`: number | string | [Num](num.md)): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:162

**Parameters:**

Name | Type |
------ | ------ |
`other` | number &#124; string &#124; [Num](num.md) |

**Returns:** *[Num](num.md)*

___

###  toInt

▸ **toInt**(): *[Num](num.md)*

Defined in src/monads/primitive/num.monad.ts:126

Math.trunc()

**Returns:** *[Num](num.md)*

___

###  toString

▸ **toString**(`radix`: number): *string*

*Overrides [Monad](monad.md).[toString](monad.md#tostring)*

Defined in src/monads/primitive/num.monad.ts:119

**Parameters:**

Name | Type | Default |
------ | ------ | ------ |
`radix` | number | 10 |

**Returns:** *string*

___

### `Static` from

▸ **from**(`val?`: any): *[Num](num.md)*

*Overrides [Monad](monad.md).[from](monad.md#static-from)*

Defined in src/monads/primitive/num.monad.ts:103

Coerces anything into a Num

**`see`** [Num.of](num.md#static-of)

**Parameters:**

Name | Type |
------ | ------ |
`val?` | any |

**Returns:** *[Num](num.md)*

___

### `Static` isNum

▸ **isNum**(`val`: any): *val is Num*

Defined in src/monads/primitive/num.monad.ts:76

Indicates if passed value is an instance of `Num`
```ts
if (Num.isNum(val)) {
    // is a Num
}
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *val is Num*

___

### `Static` of

▸ **of**(`val`: any): *[Num](num.md)*

*Overrides [Monad](monad.md).[of](monad.md#static-of)*

Defined in src/monads/primitive/num.monad.ts:95

Returns Num representation of the passed value.

```ts
const strBool: Num<0> = Num.of(0);
const strBool: Num<1> = Num.of(true);

const strMonad: Num<10> = Num.from('10');
const strMonad: Num<NaN> = Num.from('foo');

const arrBool: Num<2> = Num.of([2]);

const arrBool: Num<NaN> = Num.of([1,2,3]);
```

**Parameters:**

Name | Type |
------ | ------ |
`val` | any |

**Returns:** *[Num](num.md)*
