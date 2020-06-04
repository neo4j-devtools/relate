import {Field, ObjectType} from '@nestjs/graphql';
import {IDbms} from '@relate/common';

import {Dbms} from '../../dbms/dbms.types';

@ObjectType()
export class AppLaunchData {
    @Field(() => String)
    environmentId: string;

    @Field(() => String)
    appName: string;

    @Field(() => Dbms)
    dbms: IDbms;

    @Field(() => String, {nullable: true})
    principal?: string;

    @Field(() => String, {nullable: true})
    accessToken?: string;
}
