export function getAccessTokenRCKey(environmentId: string, dbmsId: string, dbmsUser: string): string {
    return `//${environmentId}/${dbmsId}/${dbmsUser}/:_accessToken`;
}
