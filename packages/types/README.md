# @relate/types

The Relate type system package

### Installation

```
$ npm ci
```

### Building

```
$ npm run build
```

### Testing

```
$ npm test
```

## Monads

Helpful Resources

-   [What The Heck Is A Monad](https://khanlou.com/2015/09/what-the-heck-is-a-monad/)
-   [A Guide to Scala Collections: Exploring Monads in Scala Collections](https://blog.redelastic.com/a-guide-to-scala-collections-exploring-monads-in-scala-collections-ef810ef3aec3)
-   [Practical introduction to Functional Programming with JS](https://www.codingame.com/playgrounds/2980/practical-introduction-to-functional-programming-with-js/functors-and-monads)

We have our own monadic type system which is continuously under development. The aim of this system is to ensure type-safety, reduce complexity of logic and control-flows, improve legibility of code, and improve TypeScripts ability to do type-inference et al.

**[Read the docs](./documentation/README.md)**

We currently have the main data types of JS represented
-   [None (`undefined`)](./src/monads/primitive/none.monad.ts)
-   [Nil (`null`)](./src/monads/primitive/nil.monad.ts)
-   [Num (`Number`)](src/monads/primitive/num.monad.ts)
-   [Str (`String`)](./src/monads/primitive/str.monad.ts)
-   [Bool (`Boolean`)](./src/monads/primitive/bool.monad.ts)
-   [List (`Array`)](./src/monads/primitive/list.monad.ts)
-   [Dict (`Object || Map`)](./src/monads/primitive/dict.monad.ts)

### Some examples

Create a number, divide it, check if it's modulo is 2

```TypeScript
import {Num} from './dist';

const isModulo2: boolean = Num.of(Math.random() * 100)
    .divide(Math.random() * 100)
    .modulo(2)
    .flatMap((v) => v.equals(0));
```

Create a list, concat it with another, check if it's length is 2
```TypeScript
import {Bool, Num, List} from './dist';

const list1 = List.from([Num.from(1)]);
const list2 = List.from([Num.from(2), Num.from(2)]);
const isLength2: Bool = Bool.from(
    list1.concat(list2).length.equals(2)
);
```
