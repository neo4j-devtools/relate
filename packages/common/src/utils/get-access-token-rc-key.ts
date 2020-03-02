export function getAccessTokenRCKey(accountId: string, dbmsId: string, dbmsUser: string): string {
    return `//${accountId}/${dbmsId}/${dbmsUser}/:_accessToken`;
}
