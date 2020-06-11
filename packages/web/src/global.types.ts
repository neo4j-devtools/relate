import {ArgsType, Field, ObjectType} from '@nestjs/graphql';
import {IFile} from '@relate/common';

@ArgsType()
export class EnvironmentArgs {
    @Field(() => String, {nullable: true})
    environmentId?: string;
}
@ObjectType()
export class RelateFile implements IFile {
    @Field(() => String)
    name: string;

    @Field(() => String)
    directory: string;

    @Field(() => String)
    extension: string;
}
