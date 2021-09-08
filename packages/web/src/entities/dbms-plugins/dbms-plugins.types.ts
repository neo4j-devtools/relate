import {ArgsType, Field, InputType, ObjectType} from '@nestjs/graphql';
import {DbmsPluginConfig, IDbmsPluginInstalled, IDbmsPluginSource, IDbmsPluginVersion} from '@relate/common';
import {GraphQLJSONObject} from 'graphql-type-json';

@ObjectType()
export class DbmsPluginVersion implements IDbmsPluginVersion {
    @Field(() => String)
    version: string;

    @Field(() => String)
    neo4jVersion: string;

    @Field(() => String, {nullable: true})
    homepageUrl?: string;

    @Field(() => String)
    downloadUrl: string;

    @Field(() => String, {nullable: true})
    sha256?: string;

    @Field(() => GraphQLJSONObject)
    config: DbmsPluginConfig;
}

@ObjectType({isAbstract: true})
@InputType({isAbstract: true})
export class DbmsPluginSourceBase implements IDbmsPluginSource {
    @Field(() => String)
    name: string;

    @Field(() => String)
    homepageUrl: string;

    @Field(() => String)
    versionsUrl: string;

    @Field(() => Boolean, {nullable: true})
    isOfficial?: boolean;
}

@ObjectType()
export class DbmsPluginSource extends DbmsPluginSourceBase {}

@ObjectType()
export class DbmsPluginInstalled extends DbmsPluginSourceBase implements IDbmsPluginInstalled {
    @Field(() => DbmsPluginVersion)
    version: DbmsPluginVersion;
}

@ArgsType()
export class PluginNameArgs {
    @Field(() => String)
    pluginName: string;
}

@ObjectType()
export class UninstallDbmsPluginReturn {
    @Field(() => [String])
    dbmsIds: string[];

    @Field(() => String)
    pluginName: string;
}

@InputType()
export class DbmsPluginSourceInput extends DbmsPluginSourceBase {}

@ArgsType()
export class AddDbmsPluginSources {
    @Field(() => [DbmsPluginSourceInput])
    sources: DbmsPluginSourceInput[];
}

@ArgsType()
export class RemoveDbmsPluginSources {
    @Field(() => [String])
    names: string[];
}
