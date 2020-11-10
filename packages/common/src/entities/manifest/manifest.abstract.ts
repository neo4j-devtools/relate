import {ENTITY_TYPES} from '../../constants';
import {ManifestModel, IManifest} from '../../models';
import {EnvironmentAbstract} from '../environments';

export abstract class ManifestAbstract<
    Environment extends EnvironmentAbstract,
    Entity extends IManifest,
    Manifest extends ManifestModel<Entity>
> {
    /**
     * @hidden
     */
    constructor(
        protected readonly environment: Environment,
        protected readonly entityType: ENTITY_TYPES,
        protected readonly EntityModel: new (props: Entity) => Manifest,
        protected readonly getEntity: (nameOrId: string) => Promise<Entity>,
    ) {}

    /**
     * Add tags to an entity
     * @param   nameOrId
     * @param   tags
     */
    abstract addTags(nameOrId: string, tags: string[]): Promise<Entity>;

    /**
     * Remove tags from an entity
     * @param   nameOrId
     * @param   tags
     */
    abstract removeTags(nameOrId: string, tags: string[]): Promise<Entity>;

    /**
     * Get an entity's manifest
     * @param   id
     */
    abstract get(id: string): Promise<Manifest>;

    /**
     * Update an entity's manifest
     * @param   id
     * @param   update  Portion of the manifest to update
     */
    abstract update(id: string, update: Partial<Omit<Entity, 'id'>>): Promise<void>;
}
