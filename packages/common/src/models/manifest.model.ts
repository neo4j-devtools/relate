import {assign} from 'lodash';
import {ModelAbstract} from './model.abstract';
import {IsString, IsUUID, IsOptional} from 'class-validator';

export interface IManifestInput {
    id: string;
    name: string;
    description?: string;
    tags?: string[];
}

export interface IManifest {
    id: string;
    name: string;
    description: string;
    tags: string[];
}

export class ManifestModel<Entity extends IManifest> extends ModelAbstract<Entity> implements IManifest {
    constructor(props: any) {
        super(props);

        // reassigning default values doesn't work when it's done from the parent class
        assign(this, props);
    }

    @IsUUID()
    public id!: string;

    @IsString()
    public name!: string;

    @IsOptional()
    @IsString()
    public description = '';

    @IsOptional()
    @IsString({each: true})
    public tags: string[] = [];
}
