import {ACCOUNT_TYPES} from './constants';

export interface IAccountConfig {
    id: string;
    user: any;
    neo4jDataPath: string;
    type: ACCOUNT_TYPES;
}
