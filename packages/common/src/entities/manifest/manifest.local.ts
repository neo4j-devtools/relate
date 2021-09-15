import path from 'path';
import fse from 'fs-extra';
import {Dict, List} from '@relate/types';

import {ManifestModel, IManifest} from '../../models';
import {LocalEnvironment} from '../environments';
import {ManifestAbstract} from './manifest.abstract';
import {ENTITY_TYPES, HOOK_EVENTS} from '../../constants';
import {getManifestName} from '../../utils/system';
import {emitHookEvent} from '../../utils';

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

    public async setMetadata(nameOrId: string, key: string, value: any): Promise<Entity> {
        const {id, metadata: existing} = await this.getEntity(nameOrId);

        await this.update(
            id,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            {
                metadata: Dict.from(existing)
                    .assign({[key]: value})
                    .toObject(),
            },
            false,
        );

        return this.getEntity(id);
    }

    public async removeMetadata(nameOrId: string, ...keys: string[]): Promise<Entity> {
        const {id, metadata} = await this.getEntity(nameOrId);
        const updated = Dict.from(metadata).omit(...keys);

        // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
        // @ts-ignore
        await this.update(id, {metadata: updated}, false);

        return this.getEntity(id);
    }

    public async addTags(nameOrId: string, tags: string[]): Promise<Entity> {
        const {id, tags: existing} = await this.getEntity(nameOrId);

        await this.update(
            id,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            {
                tags: List.from(existing)
                    .concat(tags)
                    .unique()
                    .toArray(),
            },
            false,
        );

        return this.getEntity(id);
    }

    public async removeTags(nameOrId: string, tags: string[]): Promise<Entity> {
        const {id, tags: existing} = await this.getEntity(nameOrId);

        await this.update(
            id,
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            {
                tags: List.from(existing)
                    .without(...tags)
                    .toArray(),
            },
            false,
        );

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

        // @todo - We should bubble up the error here, but to do so we need to find a
        // reliable way to ensure we're not reading while the file is being written.
        try {
            await emitHookEvent(HOOK_EVENTS.MANIFEST_READ, manifestPath);
            const manifest = await fse.readJSON(manifestPath, {encoding: 'utf-8'});

            return new this.EntityModel({
                ...defaults,
                ...manifest,
                id,
            });
        } catch (e) {
            return new this.EntityModel({
                ...defaults,
                id,
            });
        }
    }

    public async update(id: string, update: Partial<Omit<Entity, 'id'>>, merge = true): Promise<void> {
        const entityRootPath = this.environment.getEntityRootPath(this.entityType, id);
        const manifestPath = path.join(entityRootPath, getManifestName(this.entityType));

        const manifest = Dict.from(await this.get(id));
        const updated = merge ? manifest.merge(update).merge({id}) : manifest.assign(update).assign({id});

        await emitHookEvent(HOOK_EVENTS.MANIFEST_WRITE, {
            manifestPath,
            update,
        });
        await fse.ensureFile(manifestPath);
        await fse.writeJson(manifestPath, new this.EntityModel(updated.toObject()), {
            encoding: 'utf8',
            spaces: 2,
        });

        if (this.reloadEntities) {
            await this.reloadEntities();
        }
    }
}
