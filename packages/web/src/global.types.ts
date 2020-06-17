import {ArgsType, Field, InputType, ObjectType, registerEnumType} from '@nestjs/graphql';
import {FILTER_COMPARATORS, FILTER_CONNECTORS, IFile, IRelateFilter} from '@relate/common';

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

registerEnumType(FILTER_COMPARATORS, {
    name: 'FILTER_COMPARATORS',
});

registerEnumType(FILTER_CONNECTORS, {
    name: 'FILTER_CONNECTORS',
});

@InputType()
export class RelateSimpleFilter implements IRelateFilter {
    @Field(() => String)
    field: string;

    @Field(() => FILTER_COMPARATORS, {nullable: true})
    type?: FILTER_COMPARATORS;

    @Field(() => FILTER_CONNECTORS, {nullable: true})
    connector?: FILTER_CONNECTORS;

    @Field(() => String)
    value: string;
}

@ArgsType()
export class FilterArgs {
    @Field(() => [RelateSimpleFilter], {nullable: true})
    filters?: RelateSimpleFilter[];
}
