import {ObjectType, ArgsType, Field} from '@nestjs/graphql';

@ArgsType()
export class ListDbArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    user: string;

    @Field(() => String)
    accessToken: string;
}

@ArgsType()
export class CreateOrDropDbArgs extends ListDbArgs {
    @Field(() => String)
    dbName: string;
}

@ObjectType()
export class Db {
    @Field(() => String)
    name: string;

    @Field(() => String)
    role: string;

    @Field(() => String)
    requestedStatus: string;

    @Field(() => String)
    currentStatus: string;

    @Field(() => String)
    error: string;

    @Field(() => Boolean)
    default: boolean;
}

@ArgsType()
export class DumpOrLoadDbArgs {
    @Field(() => String)
    dbmsId: string;

    @Field(() => String)
    database: string;

    @Field(() => String, {nullable: true})
    javaPath?: string;
}

@ArgsType()
export class DumpDbArgs extends DumpOrLoadDbArgs {
    @Field(() => String, {description: 'path to save the database dump to'})
    to: string;
}

@ArgsType()
export class LoadDbArgs extends DumpOrLoadDbArgs {
    @Field(() => String, {description: 'path to load the database dump from'})
    from: string;

    @Field(() => Boolean, {nullable: true})
    force?: boolean;
}
