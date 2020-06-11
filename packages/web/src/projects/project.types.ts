import {ObjectType, ArgsType, Field, ID} from '@nestjs/graphql';
import {IProject, IProjectDbms, IProjectManifest} from '@relate/common';

import {EnvironmentArgs, RelateFile} from '../global.types';
import {FileUpload, GraphQLUpload} from 'graphql-upload';

@ObjectType()
export class Project implements Omit<IProject, 'root'> {
    @Field(() => ID)
    id: string;

    @Field(() => String, {nullable: true})
    name: string;

    @Field(() => [ProjectDbms], {nullable: true})
    dbmss: ProjectDbms[];

    @Field(() => [ProjectDbms], {nullable: true})
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
    projectId: string;
}

@ArgsType()
export class InitProjectArgs extends EnvironmentArgs implements IProjectManifest {
    @Field(() => String)
    name: string;

    @Field(() => [ProjectDbms])
    dbmss: IProjectDbms[];
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
    fileUpload: FileUpload;
}

@ArgsType()
export class RemoveProjectFileArgs extends ProjectArgs {
    @Field(() => String)
    filePath: string;
}
