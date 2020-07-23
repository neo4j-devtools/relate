# @relate/types

The Relate type system package, a drop-in replacement for lodash following a monadic pattern.

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

We currently have the main data types of JS represented
-   [None (`undefined`)](./src/monads/primitive/none.monad.ts)
-   [Nil (`null`)](./src/monads/primitive/nil.monad.ts)
-   [Num (`Number`)](src/monads/primitive/num.monad.ts)
-   [Str (`String`)](./src/monads/primitive/str.monad.ts)
-   [Bool (`Boolean`)](./src/monads/primitive/bool.monad.ts)
-   [List (`Array`)](./src/monads/primitive/list.monad.ts)
-   [Dict (`Object || Map`)](./src/monads/primitive/dict.monad.ts)

** See the [docs](./documentation/README.md) for detailed usage **
