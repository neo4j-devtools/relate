export function getEntityDisplayName(entity: {id: string; name: string}): string {
    return `[${entity.id.slice(0, 8)}] ${entity.name}`;
}
