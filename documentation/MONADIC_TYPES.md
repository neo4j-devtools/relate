# Monadic Type System
We have our own monadic type system which is continuously under development. The aim of this system is to ensure type-safety, reduce complexity of logic and control-flows, improve legibility of code, and improve TypeScripts ability to do type-inference et al.

We use our own code-base as a living example and documentation. Please see the tests in `@relate/types` or the various utils in `@relate/common` for up to date, real-world examples of the type-system in action.

## ToC
1. [Helpful Resources](#helpful-resources)
2. [Basic Types](#basic-types)
2. [Primitive examples](#primitive-examples)
2. [Advanced examples](#advanced-examples)

## Helpful Resources
-   [What The Heck Is A Monad](https://khanlou.com/2015/09/what-the-heck-is-a-monad/)
-   [A Guide to Scala Collections: Exploring Monads in Scala Collections](https://blog.redelastic.com/a-guide-to-scala-collections-exploring-monads-in-scala-collections-ef810ef3aec3)
-   [Practical introduction to Functional Programming with JS](https://www.codingame.com/playgrounds/2980/practical-introduction-to-functional-programming-with-js/functors-and-monads)

## Basic types
We currently have the main data types of JS represented
-   [None (`undefined`)](../packages/types/src/monads/primitive/none.monad.ts)
-   [Nil (`null`)](../packages/types/src/monads/primitive/nil.monad.ts)
-   [Num (`Number`)](../packages/types/src/monads/primitive/num/num.monad.ts)
-   [Str (`String`)](../packages/types/src/monads/primitive/str.monad.ts)
-   [Bool (`Boolean`)](../packages/types/src/monads/primitive/bool.monad.ts)
-   [List (`Array`)](../packages/types/src/monads/primitive/list.monad.ts)
-   [Dict (`Object || Map`)](../packages/types/src/monads/primitive/dict.monad.ts)

## Primitive examples
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

## Advanced examples
Get the version of a neo4j distribution by checking the `neo4j.jar` version against a regex:
```TypeScript
import {InvalidArgumentError} from '@relate/common';
import {None, List} from '@relate/types';
import path from 'path';
import fse from 'fs-extra';

export async function getDistributionVersion(dbmsRoot: string): Promise<string> {
    const semverRegex = /[0-9]+\.[0-9]+\.[0-9]+/;
    const neo4jJarRegex = /^neo4j-[0-9]+\.[0-9]+\.[0-9]+\.jar$/;
    const libs = List.of(await fse.readdir(path.join(dbmsRoot, 'lib')));
    const neo4jJar = libs.find((name) => neo4jJarRegex.test(name));

    return neo4jJar
        .flatMap((jar) => {
            if (None.isNone(jar)) {
                throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
            }

            return List.from(jar.match(semverRegex)).first;
        })
        .flatMap((version) => {
            if (None.isNone(version)) {
                throw new InvalidArgumentError(`Could not find neo4j.jar in distribution`);
            }

            return version;
        });
}
```

Find distributions that satisfy our semver requirement:
```TypeScript
import {Dict, List} from '@relate/types';
import semver from 'semver';
import got from 'got';

import {
    IDbmsVersion,
    IVersionManifest,
    NEO4J_DIST_VERSIONS_URL,
    NEO4J_EDITION,
    NEO4J_ORIGIN,
    NEO4J_SUPPORTED_VERSION_RANGE
} from '<internal>';

export const fetchNeo4jVersions = async (): Promise<List<IDbmsVersion>> => {
    let versionManifest: IVersionManifest;
    try {
        versionManifest = await got(NEO4J_DIST_VERSIONS_URL).json();
    } catch {
        return List.of([]);
    }

    return Dict.from(versionManifest.versions)
        .toList()
        .filter(([versionStr]) => semver.satisfies(versionStr, NEO4J_SUPPORTED_VERSION_RANGE))
        .mapEach(([versionStr, versionObj]) => {
            let url = versionObj.dist.linux;

            if (process.platform === 'darwin') {
                url = versionObj.dist.mac;
            }

            if (process.platform === 'win32') {
                url = versionObj.dist.win;
            }

            return {
                dist: url,
                edition: url.includes(NEO4J_EDITION.ENTERPRISE) ? NEO4J_EDITION.ENTERPRISE : NEO4J_EDITION.COMMUNITY,
                origin: NEO4J_ORIGIN.ONLINE,
                version: versionStr,
            };
        });
};
```

Asyncronously read from several directories, then flatten the result:
```TypeScript
import {List, Dict} from '@relate/types';
import path from 'path';

import {IExtensionMeta, EXTENSION_TYPES, discoverExtensionDistributions} from '<internal>';

async function listInstalledExtensions(): Promise<List<IExtensionMeta>> {
    const allInstalledExtensions = await Dict.from(EXTENSION_TYPES)
        .values.mapEach((type) => discoverExtensionDistributions(path.join(this.dirPaths.extensionsData, type)))
        .unwindPromises();

    return allInstalledExtensions.flatten();
}
```

Parse a file name, extracting a valid semver version and it's "human" name, before converting it to an object
```TypeScript
import {List, None, Str} from '@relate/types';
import semver from 'semver'

import {IExtensionVersion, EXTENSION_ORIGIN} from '<internal>';

function mapArtifactoryResponse(results: List<any>): List<IExtensionVersion> {
    return results
        .mapEach(({name}) => {
            const nameVal = Str.from(name);

            return nameVal
                .replace('.tgz', '')
                .split('-')
                .last.map((versionPart) => {
                    if (None.isNone(versionPart) || versionPart.isEmpty) {
                        return None.EMPTY;
                    }

                    const found = semver.coerce(`${versionPart}`);

                    return found ? Str.from(found.version) : None.EMPTY;
                })
                .flatMap((version) => {
                    // @todo: discuss if mapping maybes should not exec if empty?
                    if (None.isNone(version)) {
                        return version;
                    }

                    return nameVal.split(`-${version}`).first.flatMap((extName) => {
                        if (None.isNone(extName)) {
                            return extName;
                        }

                        return {
                            name: `${extName}`,
                            origin: EXTENSION_ORIGIN.ONLINE,
                            version: `${version}`,
                        };
                    });
                });
        })
        .compact();
}

```
