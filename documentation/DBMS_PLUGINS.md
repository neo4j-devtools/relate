# DBMS Plugins

Extending DBMS functionality using plugins is common practice in the Neo4j
community. @relate supports the discovery and management of DBMS plugins, to
help users setup and consume Neo4j DBMSs, tools, and apps.

## Commands

Using the @relate/cli as an example:

```bash
# list available plugin sources
$ relate dbms-plugin:list-sources

# add plugin source
$ relate dbms-plugin:add-sources [...pathsOrUrls]

# remove plugin source
$ relate dbms-plugin:remove-plugin-source [...pluginNames]

# list installed plugins for a given DBMS
$ relate dbms-plugin:list <dbms>

# install plugin for one or more DBMSs
$ relate dbms-plugin:install [...dbmss] --plugin <pluginName>

# uninstall plugin for one or more DBMSs
$ relate dbms-plugin:uninstall [...dbmss] --plugin <pluginName>
```

## Plugin Discovery

Each plugin is represented by a plugin source that implements the interface
below.

```typescript
export interface IDbmsPluginSource {
    /** Plugin name */
    name: string;

    /** Plugin homepage, users are directed here for information/support */
    homepageUrl: string;

    /** URL from which to fetch available plugin versions */
    versionsUrl: string;
}
```

In addition to the list of officially supported plugins (which can be [found
here](https://dist.neo4j.org/relate/official-plugin-sources.json)) it's possible
to add external plugin sources by pointing Relate to a path or URL containing a
plugin source.

**Example**: a file containing the following, or a URL returning this object, would be a
valid source that would allow Relate to manage the JWT plugin.

```json
{
    "name": "neo4j-jwt-addon",
    "homepageUrl": "https://github.com/neo4j-devtools/relate",
    "versionsUrl": "https://s3-eu-west-1.amazonaws.com/dist.neo4j.org/relate/neo4j-jwt-addon/versions.json"
}
```

## Plugin Versions

Relate uses version files to check the compatibility between plugin and DBMS
versions, and to check which configuration changes are needed when installing a
plugin.

A version file is a JSON file containing an array of versions with each version
implementing this interface:

```typescript
export interface IDbmsPluginVersion {
    /** Plugin semver */
    version: string;

    /** Supported DBMS semver (specific or range) */
    neo4jVersion: string;

    /** Plugin homepage URL */
    homepageUrl?: string;

    /** Plugin download URL */
    downloadUrl: string;

    /** sha256b checksum */
    sha256?: string;

    /** neo4j.conf changes needed */
    config: {[key: string]: string | string[]};
}
```

An example for this file can be [found here](http://dist.neo4j.org/relate/neo4j-jwt-addon/versions.json).

**Note**: it is possible to have extra attributes in the versions objects (eg.
for maintaining backwards compatibility with other tools), these attributes will
simply be ignored by Relate.

### Plugin Config

The config key allows plugins to declare changes they need in the neo4j.conf.

```json
"config": {
    // additive
    "foo":"bar",
    "+:foo":"bar",
    // additive (only missing values)
    "+:dbms.security.procedures.whitelist":["apoc.coll.*","apoc.load.*"],
    // remove
    "-:foo": true,
    // remove (if value is "bar")
    "-:foo":"bar",
    // remove (only matching values)
    "-:dbms.security.procedures.whitelist":["apoc.coll.*","apoc.load.*"]
}
```

Specifically Relate supports add/remove operators in the config keys:

-   `+:` add key
-   `-:` remove key

Values can be specified in one of two ways: as a string, or a list of strings:

-   `+:` (add)
    -   `string:` Overwrite any existing values
    -   `string[]:` Add any non-existing values (comma separated)
-   `-:` (remove)
    -   `boolean:` Remove if key present
    -   `string:` Remove if matches existing value
    -   `string[]:` Remove matching values (comma separated)

If a plugin does not need config changes, the config property can safely be
omitted from the version schema.
