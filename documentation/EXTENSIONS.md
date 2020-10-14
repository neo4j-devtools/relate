# Extensions
`@relate` can be extended by third parties using one of two main approaches:
- Adding new [@nestjs](https://docs.nestjs.com/) modules to one of the main API surfaces (`WEB`, `SYSTEM`, `CLI`, `ELECTRON`)
- Adding static HTML bundles (e.g. Graph Apps)

Extensions installed under the `Data` directory
```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Data/extensions
# Linux
~/.local/share/neo4j-relate/extensions
# Win32
%appdata%\Local\Neo4j\Relate\Data\extensions
```

## Installing extensions
Extensions are installed through the CLI:
```sh
$ relate extension:install <name> -V <version>
```
Where version can be semver or a file path. Please see the install command for more information:
```sh
$ relate extension:install --help
```

## Developing extensions
Extensions can be linked (much like `npm link`) during development to facilitate work.
```sh
$ relate extension:link <file-path>
```
Please see the link command for more information:
```sh
$ relate extension:link --help
```

## Publishing extensions
Official extensions are published under our `@relate-ext` npm organisation and require both a formal code-review by a core contributor as well as code-signing by us (Neo4j).

## STATIC extensions
Static extensions simply need to be a directory containing at least an `index.html` file as well as a `package.json file` containing `name`, `version`, and `main` properties.

Static extensions are installed under:
```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Data/extensions/STATIC
# Linux
~/.local/share/neo4j-relate/extensions/STATIC
# Win32
%appdata%\Local\Neo4j\Relate\Data\extensions\STATIC
```
A sample `package.json`
```JSON
{
  "name": "<name>",
  "version": "<semver>",
  "main": "dist"
}
```

## Application extensions
Application extensions simply need to be a directory containing at least an `index.js` file.
The entry point of application extensions are defined in their `relate.manifest.json` file:
```JSON
{
  "name": "ext-grand-web",
  "type": "WEB",
  "main": "dist/index.js"
}
```
The entry point **must have a default export** of a `@nestjs` module. Please see https://github.com/huboneo/grandql-extension for a simple example.

Application extensions are installed under:
```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Data/extensions/<APP_TYPE>
# Linux
~/.local/share/neo4j-relate/extensions/<APP_TYPE>
# Win32
%appdata%\Local\Neo4j\Relate\Data\extensions\<APP_TYPE>
```
Where `<APP_TYPE>` is one of:
- `SYSTEM` Targeting the core system API (shared across all other APIs)
- `WEB` Targeting the HTTP API
- `CLI` Targeting the CLI API
- `ELECTRON` Targeting the Electron API
