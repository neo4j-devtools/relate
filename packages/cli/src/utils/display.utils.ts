export function getEntityDisplayName<T extends {id: string; name: string}>(entity: T): string {
    return `[${entity.id.slice(0, 8)}] ${entity.name}`;
}
