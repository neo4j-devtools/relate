/**
 * Convert `application/json` Swagger definition to `multipart/form-data`
 * @param   def     Existing OpenAPI definition
 * @return          Updated OpenAPI definition
 */
export function fixAddProjectFilesOpenAPIDef(def: any): any {
    const sourceContentType = 'application/json';
    const targetContentType = 'multipart/form-data';

    return {
        post: {
            ...def.post,
            requestBody: {
                ...def.post.requestBody,
                content: {
                    [targetContentType]: {
                        ...def.post.requestBody.content[sourceContentType],
                        schema: {
                            ...def.post.requestBody.content[sourceContentType].schema,
                            properties: {
                                ...def.post.requestBody.content[sourceContentType].schema.properties,
                                // the GraphQL Upload scalar is not understood by OpenAPI.
                                fileUpload: {
                                    type: 'string',
                                    format: 'binary',
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}
