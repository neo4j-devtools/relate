- Start Date: (2020-12-16)
- RFC PR: (https://github.com/neo4j-devtools/relate/pull/246)
- @relate Issue: (leave this empty)

# Summary
Support DBMS plugin management in the `@relate` framework. This RFC details the process for discovering available DBMS plugins, which Neo4j versions they support, as well as any and all DBMS configuration changes (in `neo4j.conf`) they require on installation.

# Basic example
Using `@relate/cli` as an example.
```
# list available plugin version sources
$ relate environment:list-plugin-sources 

# add plugin version source
$ relate environment:add-plugin-source

# remove plugin version source
$ relate environment:remove-plugin-source 

# list installed plugins for a given DBMS
$ relate dbms:list-plugins <dbmsid> 

# install/upgrade plugin for a given DBMS
$ relate dbms:install-plugin <dbmsid>

# uninstall plugin for a given DBMS
$ relate dbms:uninstall-plugin <dbmsid> 
```

# Motivation
Extending DBMS functionality using plugins is common practice in the Neo4j community. Furthermore, certain graph apps depends on one or more plugins being installed to function correctly. To this end we want to enable `@relate` to manage DBMS plugins as well as extension dependencies (on plugins and other extensions) to help users setup and consume Neo4j DBMSs, tools, and apps.

# Detailed design
## DBMS plugin discovery
We propose the creation of an official Neo4j plugin indirection file that lists officially supported plugins and where to find a comprehensive list of their versions. This file is modelled after the [current Neo4jLabs plugins.json](https://github.com/neo4j/docker-neo4j/blob/663161f5a7847bff9dcdd1e164219ba3558663bf/neo4jlabs-plugins.json).

```Typescript
interface IDBMSPluginIndirection {
    name: string; // plugin name
    homepage: string; // plugin homepage, users are directed here for information/support
    versions: string; // URL from which to fetch available plugin versions
}
```
Relate will consume the indirection file over HTTP out of the box, and offer users the ability to add/remove additional sources as needed.

The versions URL defined in the indirections file should point to a JSON list of plugin version objects, which have to meet the following schema (else they are discarded/ignored):

```Typescript
interface IDBMSPluginVersion {
    version: string; //  plugin semver 
    neo4jVersion: string; // supported DBMS semver (specific or range)
    homepage: string; // plugin homepage URL
    url: string; // plugin download URL
    sha256: string; // sha256b checksum
    config?: {[key: string]: string | string[]} // neo4j.conf changes needed
}
```
Most of the above is self explanatory, however there is some additional semantics/logic to highlight in the `config` key.

The `config` key allows plugins to declare changes to `neo4j.conf` a plugin needs. 
```
"config": {
    # additive
    "foo":"bar",
    "+:foo":"bar",
    # additive (only missing values)
    "+:dbms.security.procedures.whitelist":["apoc.coll.*","apoc.load.*"],
    # remove
    "-:foo": true,
    # remove (if value is "bar")
    "-:foo":"bar",
    # remove (only mathing values)
    "-:dbms.security.procedures.whitelist":["apoc.coll.*","apoc.load.*"],
   # request to add / remove
    "+?:dbms.security.procedures.unrestricted":["apoc.*"],
    "-?:dbms.unmanaged_extension_classes": "org.neo4j.apoc.handler=/examples/apoc",
}
```
Specifically we propose introducing add/remove operators to the config keys:
- `+:` add key
- `-:` remove key

We also propose that values can be specified in one of two ways: as a string, or a list of strings:
- `+:` (add)
    - `string`: Overwrite any existing values
    - `string[]`: Add any non-existing values (comma separated)
- `-:` (remove)
    - `boolean`: Remove if key present
    - `string`: Remove if matches existing value
    - `string[]`: Remove matching values (comma separated)

Finally we also recognize that users are not always able/willing to make changes to the config, thus we need a way to request changes (i.e. make them optional but recommended):
- `+?:` request to add key
- `-?:` request to remove key

If a plugin does not need config changes, the config property can safely be omitted from the version schema.

## Extension dependencies
With this enabled, extensions (such as graph-apps) can now declare a dependency on a DBMS plugin and/or other relate extensions.

relate.extension.json
```Typescript
export interface IInstalledExtension {
    // existing values:
    name: string;
    version: string;
    type: EXTENSION_TYPES;
    main: string;
    // new values:
    dependencies?: {
        plugins?: string[] // DBMS plugins
        extensions?: : string[] // @relate extensions
    }
}
```
It's unclear if these dependencies also need to specify a minimum version of a plugin/extension. With this information when an extension (eg. graph-app) installs we can also add any missing dependencies. 

Today there is no direct link between relate extensions and DBMSs. This means that when for example Bloom installs it is added on a system level and not for a specific DBMS.


# Drawbacks
Potential drawbacks center around maintenance costs and percieved responsibility:
- We would have to keep our indirection file up to date should a plugin version URL change.
- Since we are exposing this through `@relate` we would most likely have to help users find where to get support for a plugin (hence the "homepage" entry in the indirection file)
- Since we are modifying the DBMS config we could break installations, meaning we should offer some way to rollback plugin installations. It is not clear if the current backup/restore functionality is sufficient here as data may have changed between plugin install and rollback.


# Alternatives
One alternative discussed was to simply add the plugin version information as a JSON in the `.jar` file, but this would require pulling and unpacking plugins simply to discover if they are compatible.

Another alternative was for us (Neo4j) to host the version schemas ourselves (not just the indirection file), but this would introduce overhead as we would need to be involved every time a plugin updates/changes.

# Adoption strategy

If we implement this proposal, how will existing React developers adopt it? Is
this a breaking change? Can we write a codemod? Should we coordinate with
other projects or libraries?

# How we teach this

What names and terminology work best for these concepts and why? How is this
idea best presented? As a continuation of existing React patterns?

Would the acceptance of this proposal mean the React documentation must be
re-organized or altered? Does it change how React is taught to new developers
at any level?

How should this feature be taught to existing React developers?

# Unresolved questions

Optional, but suggested for first drafts. What parts of the design are still
TBD?
