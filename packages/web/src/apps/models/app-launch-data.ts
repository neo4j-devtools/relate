import {Field, ObjectType} from '@nestjs/graphql';
import {IDbms} from '@relate/common';

import {Dbms} from '../../dbms/dbms.types';

@ObjectType()
export class AppLaunchData {
    @Field(() => String)
    environmentId: string;

    @Field(() => String)
    appId: string;

    @Field(() => Dbms)
    dbms: IDbms;

    @Field(() => String)
    principal: string;

    @Field(() => String)
    accessToken: string;
}
