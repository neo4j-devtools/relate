import * as FileType from 'file-type';
import {GraphQLError, GraphQLScalarType} from 'graphql';
import {Readable} from 'stream';
import fse from 'fs-extra';

export interface IFileUpload {
    filename: string;
    mimetype: string;
    encoding: string;
    path?: string;
    createReadStream: () => Readable;
}

export const GraphQLUpload = new GraphQLScalarType({
    name: 'Upload',
    description: 'The `Upload` scalar type represents a file upload.',
    async parseValue(value: Promise<IFileUpload>): Promise<IFileUpload> {
        const upload = await value;

        // if we are coming from the sofa REST API the file has already been flushed to disk
        if (upload.path) {
            const uploadedFilePath = upload.path;

            return {
                ...upload,
                createReadStream: () => fse.createReadStream(uploadedFilePath),
            };
        }

        const stream = upload.createReadStream();
        const fileType = await FileType.fromStream(stream);

        // if the file is, e.g .cypher (application/octet-stream) or .txt (text/plain)
        // fileType returns undefined but we want to allow these
        // assume undefined in this case means its some sort of text stream
        if (fileType && fileType?.mime !== upload.mimetype) {
            throw new GraphQLError('Mime type does not match file content.');
        }

        return upload;
    },
    parseLiteral(ast): void {
        throw new GraphQLError('Upload literal unsupported.', ast);
    },
    serialize(value: IFileUpload): any {
        // sofa-api calls .serialize() on GraphQL scalars
        return {
            filename: value.filename,
            mimetype: value.mimetype,
            encoding: value.encoding,
            path: value.path,
        };
    },
});
