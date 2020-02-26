import {Equals, IsString} from 'class-validator';
import {IAuthToken} from 'tapestry';

import {ModelAbstract} from './model.abstract';

export class AuthTokenModel extends ModelAbstract<IAuthToken> implements IAuthToken {
    @IsString()
    @Equals('basic')
    scheme!: 'basic';

    @IsString()
    principal!: string;

    @IsString()
    credentials!: string;
}
