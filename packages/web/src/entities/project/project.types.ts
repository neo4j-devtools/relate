import {ObjectType, ArgsType, Field} from '@nestjs/graphql';
import {IProject, IProjectDbms} from '@relate/common';
import {IFileUpload, GraphQLUpload} from './graphql-upload';

import {EnvironmentArgs, RelateFile} from '../../global.types';

@ObjectType()
export class Project implements Omit<IProject, 'root'> {
    @Field(() => String)
    id: string;

    @Field(() => String)
    name: string;

    @Field(() => [ProjectDbms])
    dbmss: ProjectDbms[];

    @Field(() => [RelateFile])
    files: RelateFile[];
}

@ObjectType()
export class ProjectDbms implements IProjectDbms {
    @Field(() => String)
    name: string;

    @Field(() => String)
    connectionUri: string;

    @Field(() => String, {nullable: true})
    user?: string;

    @Field(() => String, {nullable: true})
    accessToken?: string;
}

@ArgsType()
export class ProjectArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;
}

@ArgsType()
export class InitProjectArgs extends EnvironmentArgs {
    @Field(() => String)
    name: string;
}

@ArgsType()
export class AddProjectDbmsArgs extends ProjectArgs {
    @Field(() => String)
    dbmsName: string;

    @Field(() => String)
    dbmsId: string;

    @Field(() => String, {nullable: true})
    user?: string;

    @Field(() => String, {nullable: true})
    accessToken?: string;
}

@ArgsType()
export class RemoveProjectDbmsArgs extends ProjectArgs {
    @Field(() => String)
    dbmsName: string;
}

@ArgsType()
export class AddProjectFileArgs extends ProjectArgs {
    @Field(() => String, {nullable: true})
    destination?: string;

    @Field(() => GraphQLUpload)
    fileUpload: Promise<IFileUpload>;
}

@ArgsType()
export class RemoveProjectFileArgs extends ProjectArgs {
    @Field(() => String)
    filePath: string;
}
