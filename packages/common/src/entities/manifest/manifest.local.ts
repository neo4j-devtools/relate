import path from 'path';
import fse from 'fs-extra';
import {Dict, List} from '@relate/types';

import {ManifestModel, IManifest} from '../../models';
import {LocalEnvironment} from '../environments';
import {ManifestAbstract} from './manifest.abstract';
import {ENTITY_TYPES} from '../../constants';
import {getManifestName} from '../../utils/system';

export class ManifestLocal<Entity extends IManifest, Manifest extends ManifestModel<Entity>> extends ManifestAbstract<
    LocalEnvironment,
    Entity,
    Manifest
> {
    constructor(
        protected readonly environment: LocalEnvironment,
        protected readonly entityType: ENTITY_TYPES,
        protected readonly EntityModel: new (props: Entity) => Manifest,
        protected readonly getEntity: (nameOrId: string) => Promise<Entity>,
        protected readonly reloadEntities?: () => Promise<void>,
    ) {
        super(environment, entityType, EntityModel, getEntity);
    }

    public async addMetadata(nameOrId: string, metadata: Record<string, any>): Promise<Entity> {
        const {id, metadata: existing} = await this.getEntity(nameOrId);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await this.update(id, {
            metadata: Dict.from(existing)
                .assign(metadata)
                .toObject(),
        });

        return this.getEntity(id);
    }

    public async removeMetadata(nameOrId: string, keys: string[]): Promise<Entity> {
        const {id, metadata} = await this.getEntity(nameOrId);
        const updated = Dict.from(metadata).omit(...keys);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await this.update(id, {metadata: updated});

        return this.getEntity(id);
    }

    public async addTags(nameOrId: string, tags: string[]): Promise<Entity> {
        const {id, tags: existing} = await this.getEntity(nameOrId);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await this.update(id, {
            tags: List.from(existing)
                .concat(tags)
                .unique()
                .toArray(),
        });

        return this.getEntity(id);
    }

    public async removeTags(nameOrId: string, tags: string[]): Promise<Entity> {
        const {id, tags: existing} = await this.getEntity(nameOrId);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await this.update(id, {
            tags: List.from(existing)
                .without(...tags)
                .toArray(),
        });

        return this.getEntity(id);
    }

    public async get(id: string): Promise<Manifest> {
        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        const defaults: Entity = {
            name: '',
            description: '',
            tags: [],
        };

        const entityRootPath = this.environment.getEntityRootPath(this.entityType, id);
        const manifestPath = path.join(entityRootPath, getManifestName(this.entityType));

        const manifestExists = await fse.pathExists(manifestPath);
        if (!manifestExists) {
            return new this.EntityModel({
                ...defaults,
                id,
            });
        }

        const manifest = await fse.readJson(manifestPath);
        return new this.EntityModel({
            ...defaults,
            ...manifest,
            id,
        });
    }

    public async update(id: string, update: Partial<Omit<Entity, 'id'>>): Promise<void> {
        const entityRootPath = this.environment.getEntityRootPath(this.entityType, id);
        const manifestPath = path.join(entityRootPath, getManifestName(this.entityType));

        const manifest = Dict.from(await this.get(id));
        const updated = manifest.assign(update).assign({id});

        await fse.ensureFile(manifestPath);
        await fse.writeJson(manifestPath, new this.EntityModel(updated.toObject()), {
            spaces: 2,
        });

        if (this.reloadEntities) {
            await this.reloadEntities();
        }
    }
}
