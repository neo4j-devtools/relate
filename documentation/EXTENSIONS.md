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

## STATIC extensions
Static extensions simply need to be a directory containing at least an `index.html` file.

Static extensions are installed under:
```sh
# Darwin
~/Library/Application Support/com.Neo4j.Relate/Data/extensions/STATIC
# Linux
~/.local/share/neo4j-relate/extensions/STATIC
# Win32
%appdata%\Local\Neo4j\Relate\Data\extensions\STATIC
```

## Application extensions
Application extensions simply need to be a directory containing at least an `index.js` file.
The entrypoint of application extensions are defined in their `relate.manifest.json` file:
```JSON
{
  "name": "ext-grand-web",
  "type": "WEB",
  "main": "dist/index.js"
}
```
The entrypoint **must have a default export** of a `@nestjs` module. Please see https://github.com/huboneo/grandql-extension for a simple example.

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
- `System` Targeting the core system API (shared across all other APIs)
- `WEB` Targeting the HTTP API
- `CLI` Targeting the CLI API
- `ELECTRON` Targeting the Electron API
